import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  useAuth,
  useOrganization,
  useOrganizationList,
  useUser,
} from "@clerk/tanstack-react-start";
import { ArrowLeft, CaretRight } from "@phosphor-icons/react";
import { Button } from "~/components/ui/button";
import { StepProgress } from "~/components/onboarding/step-shell";
import {
  AccountTypeStep,
  FirstMonitorStep,
  IndustryStep,
  InviteStep,
  RoleStep,
  TeamSizeStep,
  UseCaseStep,
  WorkspaceStep,
} from "~/components/onboarding/steps";
import {
  emptyOnboardingData,
  getSteps,
  isStepComplete,
  suggestWorkspaceName,
  type OnboardingData,
  type StepId,
} from "~/lib/onboarding";
import { api } from "~/lib/api";

/**
 * Gating happens on the client rather than in `beforeLoad`. Straight after
 * signup the server has not seen the new Clerk session cookie yet, so a
 * server-side check bounces the user to /login — where `<SignIn />` renders
 * nothing because they are, in fact, already signed in.
 */
export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
});

const optionalSteps: StepId[] = ["invite", "firstMonitor"];

function OnboardingPage() {
  const navigate = useNavigate();
  const { user, isLoaded: userLoaded } = useUser();
  const { isLoaded: authLoaded, isSignedIn, orgId } = useAuth();
  const { organization } = useOrganization();
  const {
    isLoaded: orgListLoaded,
    createOrganization,
    setActive,
    userMemberships,
  } = useOrganizationList({ userMemberships: true });

  const [data, setData] = useState<OnboardingData>(emptyOnboardingData);
  const [stepIndex, setStepIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const steps = useMemo(() => getSteps(data), [data]);
  const currentStep = steps[Math.min(stepIndex, steps.length - 1)];
  const isLastStep = stepIndex >= steps.length - 1;
  const canContinue = isStepComplete(currentStep, data);
  const onboardingComplete = user?.unsafeMetadata.argusOnboardingComplete === true;

  // Clerk may create an organization before it redirects here. Only setup
  // completion, recorded after `finish`, should send a person to the dashboard.
  useEffect(() => {
    if (!authLoaded || !userLoaded || submitting) return;
    if (!isSignedIn) {
      void navigate({ to: "/login" });
      return;
    }
    if (onboardingComplete) {
      void navigate({ to: "/monitors" });
    }
  }, [authLoaded, isSignedIn, navigate, onboardingComplete, submitting, userLoaded]);

  // Clerk does not always restore an active organization on sign-in. Someone
  // who already belongs to a workspace must not be asked to create a second
  // one, so adopt their existing membership instead of showing the wizard.
  const existingMembership = userMemberships?.data?.[0];

  useEffect(() => {
    if (!orgListLoaded || submitting || orgId) return;
    if (!existingMembership || !setActive) return;
    void setActive({ organization: existingMembership.organization.id });
  }, [orgListLoaded, submitting, orgId, existingMembership, setActive]);

  // Reuse the Clerk organization that may have been created before this wizard
  // rather than creating a duplicate at the final step.
  useEffect(() => {
    if (data.workspaceName || !organization?.name) return;
    setData((d) => ({ ...d, workspaceName: organization.name }));
  }, [data.workspaceName, organization?.name]);

  // Prefill a sensible workspace name once we know who they are.
  useEffect(() => {
    if (data.workspaceName || organization?.name || !user?.firstName) return;
    const suggestion = suggestWorkspaceName(data.accountType, user.firstName);
    if (suggestion) setData((d) => ({ ...d, workspaceName: suggestion }));
  }, [data.accountType, data.workspaceName, organization?.name, user?.firstName]);

  function update(patch: Partial<OnboardingData>) {
    setData((d) => ({ ...d, ...patch }));
    setError("");
  }

  function goBack() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function goNext() {
    if (!isLastStep) {
      setStepIndex((i) => i + 1);
      return;
    }
    void finish();
  }

  async function finish() {
    if (!orgListLoaded || !user || (!orgId && (!createOrganization || !setActive))) {
      setError("Still connecting to your account. Try again in a moment.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      let activeOrganizationId = orgId;
      if (!activeOrganizationId) {
        const createdOrganization = await createOrganization({
          name: data.workspaceName.trim(),
        });
        activeOrganizationId = createdOrganization.id;
        await setActive({ organization: activeOrganizationId });
      }

      await saveProfile(activeOrganizationId);
      await user.updateMetadata({
        unsafeMetadata: {
          argusOnboardingComplete: true,
          argusOnboardingOrganizationId: activeOrganizationId,
        },
      });
      await sendInvites();
      await createFirstMonitor();

      await navigate({ to: "/monitors" });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "We couldn't finish setting up your workspace. Please try again.",
      );
      setSubmitting(false);
    }
  }

  async function saveProfile(activeOrganizationId?: string) {
    const res = await api("/api/onboarding", {
      method: "POST",
      organizationId: activeOrganizationId,
      body: JSON.stringify({
        accountType: data.accountType,
        role: data.role,
        useCase: data.useCase,
        teamSize: data.teamSize || undefined,
        industry: data.industry || undefined,
        workspaceName: data.workspaceName.trim(),
      }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? "Failed to save your workspace details");
    }
  }

  // Invites and the first monitor are optional extras: a failure here should
  // not strand the user outside their freshly created workspace.
  async function sendInvites() {
    if (data.inviteEmails.length === 0) return;
    try {
      await api("/api/onboarding/invites", {
        method: "POST",
        body: JSON.stringify({ emails: data.inviteEmails }),
      });
    } catch {
      // Surfaced later from the members screen.
    }
  }

  async function createFirstMonitor() {
    const name = data.monitorName.trim();
    const url = data.monitorUrl.trim();
    if (!name || !url) return;

    try {
      await api("/api/monitors", {
        method: "POST",
        body: JSON.stringify({ name, url, method: "GET", intervalSeconds: 300 }),
      });
    } catch {
      // The dashboard's empty state will prompt them again.
    }
  }

  // A membership only needs settling while Clerk has not yet made it active.
  const settling = !orgListLoaded || (!orgId && Boolean(existingMembership));

  if (
    !authLoaded ||
    !userLoaded ||
    (!isSignedIn && !submitting) ||
    (onboardingComplete && !submitting) ||
    (settling && !submitting)
  ) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#111111]">
        <span className="sr-only">Loading your workspace setup</span>
        <span className="size-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  return (
    <div className="dark relative isolate min-h-svh overflow-hidden bg-[#111111] px-4 py-5 text-zinc-100 sm:px-6 sm:py-7">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[44vh] opacity-40 [mask-image:linear-gradient(to_top,black,transparent)]"
        style={{
          backgroundImage:
            "linear-gradient(30deg,transparent_49.4%,rgba(255,255,255,0.13)_49.6%,rgba(255,255,255,0.13)_50.4%,transparent_50.6%),linear-gradient(-30deg,transparent_49.4%,rgba(255,255,255,0.13)_49.6%,rgba(255,255,255,0.13)_50.4%,transparent_50.6%)",
          backgroundSize: "96px 56px",
          backgroundPosition: "center bottom",
        }}
      />
      <div className="relative mx-auto flex min-h-[calc(100svh-2.5rem)] w-full max-w-6xl flex-col sm:min-h-[calc(100svh-3.5rem)]">
        <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <span className="flex items-center gap-2 text-sm font-semibold tracking-tight text-white">
            Strauz
          </span>
          <StepProgress total={steps.length} current={stepIndex} />
          <span className="text-right text-xs text-zinc-500">
            {stepIndex + 1} of {steps.length}
          </span>
        </header>

        <main className="flex flex-1 items-center justify-center py-12 sm:py-16">
          <div className="w-full max-w-md">
            <StepBody step={currentStep} data={data} update={update} />

            {error && (
              <p className="mt-5 text-center text-sm text-red-400" role="alert">
                {error}
              </p>
            )}

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
              <Button
                type="button"
                variant="neutral"
                mode="ghost"
                onClick={goBack}
                disabled={stepIndex === 0 || submitting}
                icon={ArrowLeft}
              >
                Back
              </Button>

              <div className="flex items-center gap-2">
                {optionalSteps.includes(currentStep) && (
                  <Button
                    type="button"
                    variant="neutral"
                    mode="ghost"
                    onClick={goNext}
                    disabled={submitting}
                  >
                    Skip
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={goNext}
                  disabled={!canContinue || submitting}
                  loading={submitting}
                >
                  {isLastStep ? "Finish setup" : "Continue"}
                  {!isLastStep && <CaretRight className="size-3.5" weight="bold" />}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StepBody({
  step,
  data,
  update,
}: {
  step: StepId;
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
}) {
  switch (step) {
    case "accountType":
      return <AccountTypeStep data={data} update={update} />;
    case "role":
      return <RoleStep data={data} update={update} />;
    case "useCase":
      return <UseCaseStep data={data} update={update} />;
    case "teamSize":
      return <TeamSizeStep data={data} update={update} />;
    case "industry":
      return <IndustryStep data={data} update={update} />;
    case "workspace":
      return <WorkspaceStep data={data} update={update} />;
    case "invite":
      return <InviteStep data={data} update={update} />;
    case "firstMonitor":
      return <FirstMonitorStep data={data} update={update} />;
  }
}
