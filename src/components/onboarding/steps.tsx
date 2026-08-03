import { useState } from "react";
import {
  Buildings,
  Briefcase,
  Envelope,
  Plus,
  User,
  X,
} from "@phosphor-icons/react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { ChoiceChip, OptionCard, StepShell } from "./step-shell";
import {
  industryOptions,
  roleOptions,
  teamSizeOptions,
  type OnboardingData,
} from "~/lib/onboarding";

type StepProps = {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
};

export function AccountTypeStep({ data, update }: StepProps) {
  return (
    <StepShell
      title="How will you use Strauz?"
      description="This helps us tailor your workspace. You can change it later."
    >
      <div className="flex flex-col gap-3">
        <OptionCard
          icon={User}
          title="Just me"
          description="Monitor your own services on a personal workspace."
          selected={data.accountType === "individual"}
          onSelect={() => update({ accountType: "individual" })}
        />
        <OptionCard
          icon={Buildings}
          title="My team"
          description="Collaborate with teammates on shared monitors and incidents."
          selected={data.accountType === "team"}
          onSelect={() => update({ accountType: "team" })}
        />
      </div>
    </StepShell>
  );
}

export function RoleStep({ data, update }: StepProps) {
  return (
    <StepShell
      title="What best describes your role?"
      description="We use this to prioritise the features that matter to you."
    >
      <div className="flex flex-wrap justify-center gap-2">
        {roleOptions.map((role) => (
          <ChoiceChip
            key={role}
            selected={data.role === role}
            onSelect={() => update({ role })}
          >
            {role}
          </ChoiceChip>
        ))}
      </div>
    </StepShell>
  );
}

export function UseCaseStep({ data, update }: StepProps) {
  return (
    <StepShell
      title="What are you monitoring?"
      description="Personal side projects and production workloads need different defaults."
    >
      <div className="flex flex-col gap-3">
        <OptionCard
          icon={Briefcase}
          title="Work"
          description="Production services, customer-facing apps, and internal tools."
          selected={data.useCase === "work"}
          onSelect={() => update({ useCase: "work" })}
        />
        <OptionCard
          icon={User}
          title="Personal projects"
          description="Side projects, homelab services, and experiments."
          selected={data.useCase === "personal"}
          onSelect={() => update({ useCase: "personal" })}
        />
      </div>
    </StepShell>
  );
}

export function TeamSizeStep({ data, update }: StepProps) {
  return (
    <StepShell
      title="How large is your company?"
      description="This helps us recommend the right plan and limits."
    >
      <div className="flex flex-wrap justify-center gap-2">
        {teamSizeOptions.map((option) => (
          <ChoiceChip
            key={option.value}
            selected={data.teamSize === option.value}
            onSelect={() => update({ teamSize: option.value })}
          >
            {option.label}
          </ChoiceChip>
        ))}
      </div>
    </StepShell>
  );
}

export function IndustryStep({ data, update }: StepProps) {
  return (
    <StepShell
      title="What industry are you in?"
      description="We use this to shape templates and status page defaults."
    >
      <div className="flex flex-wrap justify-center gap-2">
        {industryOptions.map((industry) => (
          <ChoiceChip
            key={industry}
            selected={data.industry === industry}
            onSelect={() => update({ industry })}
          >
            {industry}
          </ChoiceChip>
        ))}
      </div>
    </StepShell>
  );
}

export function WorkspaceStep({ data, update }: StepProps) {
  const initial = data.workspaceName.trim().charAt(0).toUpperCase() || "W";

  return (
    <StepShell
      title="Name your workspace"
      description="This is what your team will see. You can rename it any time."
    >
      <div className="flex flex-col items-center gap-5">
        <div className="flex size-14 items-center justify-center rounded-xl bg-primary text-xl font-semibold text-primary-foreground">
          {initial}
        </div>

        <div className="w-full space-y-2">
          <Label htmlFor="workspace-name">Workspace name</Label>
          <Input
            id="workspace-name"
            value={data.workspaceName}
            onChange={(e) => update({ workspaceName: e.target.value })}
            placeholder="Acme Inc."
            autoFocus
            maxLength={120}
          />
        </div>
      </div>
    </StepShell>
  );
}

export function InviteStep({ data, update }: StepProps) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  function addEmail() {
    const email = draft.trim().toLowerCase();
    if (!email) return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    if (data.inviteEmails.includes(email)) {
      setError("That teammate is already on the list");
      return;
    }
    if (data.inviteEmails.length >= 20) {
      setError("You can invite up to 20 teammates here");
      return;
    }

    update({ inviteEmails: [...data.inviteEmails, email] });
    setDraft("");
    setError("");
  }

  function removeEmail(email: string) {
    update({ inviteEmails: data.inviteEmails.filter((e) => e !== email) });
  }

  return (
    <StepShell
      title="Invite your teammates"
      description="They'll get an email invitation to join this workspace. You can skip this and invite people later."
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <Input
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addEmail();
                }
              }}
              placeholder="teammate@company.com"
              type="email"
              aria-label="Teammate email"
              aria-invalid={Boolean(error)}
            />
            {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
          </div>
          <Button
            type="button"
            variant="neutral"
            mode="stroke"
            onClick={addEmail}
            icon={Plus}
            aria-label="Add teammate"
          >
            Add
          </Button>
        </div>

        {data.inviteEmails.length > 0 && (
          <ul className="flex flex-col gap-2">
            {data.inviteEmails.map((email) => (
              <li
                key={email}
                className="flex items-center gap-2.5 rounded-lg bg-card px-3 py-2.5 ring-1 ring-inset ring-border"
              >
                <Envelope className="size-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                  {email}
                </span>
                <button
                  type="button"
                  onClick={() => removeEmail(email)}
                  className="cursor-pointer rounded p-0.5 text-muted-foreground transition hover:text-foreground"
                  aria-label={`Remove ${email}`}
                >
                  <X className="size-3.5" weight="bold" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </StepShell>
  );
}

export function FirstMonitorStep({ data, update }: StepProps) {
  return (
    <StepShell
      title="Add your first monitor"
      description="Point Strauz at a URL and we'll start checking it right away. You can skip this and add monitors later."
    >
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="monitor-name">Monitor name</Label>
          <Input
            id="monitor-name"
            value={data.monitorName}
            onChange={(e) => update({ monitorName: e.target.value })}
            placeholder="Marketing site"
            maxLength={120}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="monitor-url">URL</Label>
          <Input
            id="monitor-url"
            value={data.monitorUrl}
            onChange={(e) => update({ monitorUrl: e.target.value })}
            placeholder="https://example.com"
            type="url"
            className="font-sans"
          />
        </div>
      </div>
    </StepShell>
  );
}
