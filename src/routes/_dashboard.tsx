import { Outlet, createFileRoute, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  House,
  Monitor,
  WarningCircle,
  StackSimple,
  Bell,
  CreditCard,
  CaretRight,
  CaretDown,
  CaretUp,
  MagnifyingGlass,
  SidebarSimple,
  Gear,
  Question,
  BookOpen,
  SlidersHorizontal,
  Minus,
  Circle,
  CheckCircle,
} from "@phosphor-icons/react";
import {
  OrganizationSwitcher,
  UserButton,
  useAuth,
  useOrganization,
  useUser,
  useClerk,
} from "@clerk/tanstack-react-start";
import { cn } from "../lib/utils";
import { Badge } from "../components/ui/badge";
import * as Dropdown from "../components/ui/dropdown";
import { api } from "../lib/api";
import { ThemeSwitcher } from "../components/theme-switcher";
import { requireAuthFn } from "../lib/auth-server";

export const Route = createFileRoute("/_dashboard")({
  beforeLoad: async () => {
    await requireAuthFn();
  },
  component: DashboardLayout,
});

const navItems = [
  { href: "/", label: "Home", icon: House },
  { href: "/monitors", label: "Monitors", icon: Monitor },
  { href: "/incidents", label: "Incidents", icon: WarningCircle },
  { href: "/status-pages", label: "Status Pages", icon: StackSimple },
  { href: "/alert-channels", label: "Alert Channels", icon: Bell },
  { href: "/billing", label: "Billing", icon: CreditCard },
];

function DashboardLayout() {
  const navigate = useNavigate();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const onboardingComplete = user?.unsafeMetadata.argusOnboardingComplete === true;

  useEffect(() => {
    if (!authLoaded || !userLoaded || !isSignedIn || onboardingComplete) return;
    void navigate({ to: "/onboarding" });
  }, [authLoaded, isSignedIn, navigate, onboardingComplete, userLoaded]);

  if (!authLoaded || !userLoaded || (isSignedIn && !onboardingComplete)) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#111111]">
        <span className="sr-only">Taking you to workspace setup</span>
        <span className="size-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  return <DashboardShell />;
}

function DashboardShell() {
  const pathname = useLocation().pathname;
  const { isLoaded } = useAuth();
  const { organization } = useOrganization();
  const { openUserProfile } = useClerk();
  const [plan, setPlan] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [showGettingStarted, setShowGettingStarted] = useState(true);
  const [counts, setCounts] = useState({ monitors: 0, channels: 0, pages: 0, incidents: 0 });

  useEffect(() => {
    if (!isLoaded || !organization) return;
    api("/api/billing/plan")
      .then((res) => res.json())
      .then((data) => setPlan(data.plan))
      .catch(() => {});

    Promise.all([
      api("/api/monitors").then((r) => (r.ok ? r.json() : [])).catch(() => []),
      api("/api/alert-channels").then((r) => (r.ok ? r.json() : [])).catch(() => []),
      api("/api/status-pages").then((r) => (r.ok ? r.json() : [])).catch(() => []),
      api("/api/incidents").then((r) => (r.ok ? r.json() : [])).catch(() => []),
    ]).then(([monitors, channels, pages, incidents]) => {
      setCounts({
        monitors: Array.isArray(monitors) ? monitors.length : 0,
        channels: Array.isArray(channels) ? channels.length : 0,
        pages: Array.isArray(pages) ? pages.length : 0,
        incidents: Array.isArray(incidents) ? incidents.length : 0,
      });
    });
  }, [isLoaded, organization?.id, pathname]);

  useEffect(() => {
    const handleExpired = () => {
      window.location.href = "/login";
    };
    window.addEventListener("auth:expired", handleExpired);
    return () => window.removeEventListener("auth:expired", handleExpired);
  }, []);

  const onboardingSteps = [
    { label: "Create your first monitor", href: "/monitors/new", completed: counts.monitors > 0 },
    { label: "Configure alert channels", href: "/alert-channels", completed: counts.channels > 0 },
    { label: "Create a status page", href: "/status-pages", completed: counts.pages > 0 },
    { label: "Try incident management", href: "/incidents", completed: counts.incidents > 0 },
  ];

  const completedStepsCount = onboardingSteps.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedStepsCount / onboardingSteps.length) * 100);
  const isPro = plan === "pro";

  return (
    <div className="flex h-svh max-h-svh overflow-hidden bg-[#09090b] font-sans text-sm text-foreground antialiased selection:bg-blue-500/20 transition-colors duration-300">
      <aside
        className={cn(
          "flex shrink-0 flex-col bg-[#0f0f12] transition-[width] duration-200 ease-linear select-none border-r border-zinc-800/60",
          collapsed ? "w-17" : "w-65",
        )}
      >
        {/* Workspace Top Bar */}
        <div className={cn("flex items-center p-3.5", collapsed ? "justify-center" : "justify-between")}>
          {!collapsed && (
            <div className="relative min-w-0 flex-1 overflow-hidden pr-1">
              <OrganizationSwitcher
                hidePersonal
                afterCreateOrganizationUrl="/"
                afterSelectOrganizationUrl="/"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    organizationSwitcherTrigger:
                      "w-full justify-between rounded-lg border-0 bg-transparent py-1 pl-1 pr-8 text-sm font-semibold !text-zinc-100 hover:bg-zinc-800/60 [&_*]:!text-zinc-100",
                    organizationSwitcherTriggerIcon: "hidden",
                    organizationSwitcherTrigger__organizationName:
                      "!text-zinc-100",
                    organizationSwitcherTriggerOrganizationPreviewName:
                      "!text-zinc-100",
                    organizationSwitcherTriggerOrganizationPreviewTextContainer:
                      "!text-zinc-100",
                    organizationPreviewMainIdentifier: "!text-zinc-100",
                    organizationPreviewSecondaryIdentifier: "!text-zinc-400",
                    organizationSwitcherPopoverCard: "border border-zinc-800 bg-[#18181b] text-zinc-100",
                    organizationSwitcherPopoverActionButton: "text-zinc-100 hover:bg-zinc-800",
                  },
                }}
              />
              <span className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 flex-col text-zinc-400">
                <CaretUp className="size-2.5" weight="fill" />
                <CaretDown className="-mt-1 size-2.5" weight="fill" />
              </span>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="ml-1 flex size-7 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
              aria-label="Collapse sidebar"
            >
              <SidebarSimple className="size-4" />
            </button>
          )}
        </div>

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="mx-auto mb-2 flex size-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
            aria-label="Expand sidebar"
          >
            <CaretRight className="size-4" />
          </button>
        )}

        {/* Main Nav Items */}
        <nav className="space-y-0.5 px-3 py-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/"
                ? pathname === "/" || pathname === ""
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                to={href}
                title={collapsed ? label : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition font-medium",
                  collapsed && "justify-center px-0",
                  isActive
                    ? "bg-zinc-800/80 font-semibold text-zinc-100 shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200",
                )}
              >
                <Icon
                  className={cn("size-4 shrink-0", isActive ? "text-zinc-100" : "text-zinc-400")}
                  weight={isActive ? "bold" : "regular"}
                />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Recent Section */}
        {!collapsed && (
          <div className="mt-4 px-3">
            <div className="flex items-center justify-between px-2.5 py-1 text-xs font-semibold text-zinc-400">
              <span>Recent</span>
              <div className="flex items-center gap-1">
                <button className="p-0.5 hover:text-zinc-200" title="Search">
                  <MagnifyingGlass className="size-3.5" />
                </button>
                <button className="p-0.5 hover:text-zinc-200" title="Filter">
                  <SlidersHorizontal className="size-3.5" />
                </button>
              </div>
            </div>
            <div className="px-2.5 py-2 text-xs text-zinc-500">No active alerts</div>
          </div>
        )}

        {/* Argus Onboarding / Getting Started Widget */}
        {!collapsed && showGettingStarted && (
          <div className="mx-3 mt-4 mb-3 rounded-xl border border-zinc-800/80 bg-[#141417] p-3 text-xs">
            <div className="flex items-center justify-between font-medium text-zinc-200">
              <span>Getting started</span>
              <button
                onClick={() => setShowGettingStarted(false)}
                className="text-zinc-500 hover:text-zinc-300"
                title="Minimize"
              >
                <Minus className="size-3.5" />
              </button>
            </div>

            {/* Dynamic Progress bar */}
            <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400">
              <div className="h-1 flex-1 rounded-full bg-zinc-800 mr-2 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="font-mono text-[10px]">{progressPercent}%</span>
            </div>

            {/* Checklist with Completed Checkmarks */}
            <div className="mt-3 space-y-2 text-[11px]">
              {onboardingSteps.map(({ label, href, completed }) => (
                <Link
                  key={label}
                  to={href}
                  className="flex items-center gap-2 text-zinc-400 hover:text-blue-400 transition"
                >
                  {completed ? (
                    <CheckCircle className="size-3.5 text-emerald-400 shrink-0" weight="fill" />
                  ) : (
                    <Circle className="size-3.5 text-zinc-600 shrink-0" />
                  )}
                  <span className={cn("truncate", completed && "text-zinc-200 line-through opacity-80")}>
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Options (Settings, Help, Resources) */}
        {!collapsed && (
          <div className="px-3 pb-2 space-y-0.5">
            <button
              onClick={() => openUserProfile()}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200 font-medium text-left"
            >
              <Gear className="size-4 shrink-0" />
              <span>Settings</span>
            </button>
            <a
              href="#"
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200 font-medium"
            >
              <Question className="size-4 shrink-0" />
              <span>Help</span>
            </a>

            {/* Resources (Active style with blue ring and blue dot as in reference) */}
            <a
              href="#"
              className="flex items-center justify-between rounded-lg border border-blue-500/80 bg-blue-500/10 px-2.5 py-1.5 text-xs font-semibold text-blue-400 transition"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="size-4 shrink-0 text-blue-400" />
                <span>Resources</span>
              </div>
              <span className="size-1.5 rounded-full bg-blue-400" />
            </a>
          </div>
        )}

        {/* Footer & User Profile */}
        <div className="mt-auto shrink-0 border-t border-zinc-800/80 p-3">
          <div className={cn("mb-2 flex", collapsed ? "justify-center" : "justify-end px-1")}>
            <ThemeSwitcher />
          </div>
          {!collapsed ? (
            <UserMenu plan={plan} isPro={isPro} />
          ) : (
            <div className="flex justify-center">
              <UserButton />
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="min-h-0 flex-1 pl-0">
        <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#121215]">
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

function UserMenu({ plan, isPro }: { plan: string | null; isPro: boolean }) {
  const { user } = useUser();
  const { openUserProfile } = useClerk();
  const displayName = user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? "User";

  return (
    <Dropdown.Root>
      <Dropdown.Trigger className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left outline-none transition hover:bg-zinc-800/60">
        <UserButton />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-xs font-semibold text-zinc-100">
              {displayName}
            </span>
            {isPro && (
              <Badge variant="light" color="green" size="sm" className="px-1.5 py-0 text-[10px]">
                PRO
              </Badge>
            )}
          </div>
          <span className="truncate text-[11px] text-zinc-400">
            {plan ?? "free"} plan
          </span>
        </div>
        <CaretDown className="size-3 shrink-0 text-zinc-500" />
      </Dropdown.Trigger>
      <Dropdown.Content side="top" align="start" className="w-56">
        <Dropdown.Label>Account</Dropdown.Label>
        <Dropdown.Separator />
        <Dropdown.Item onClick={() => openUserProfile()} className="flex items-center gap-2 cursor-pointer">
          <Gear className="size-3.5" />
          <span>Account Settings</span>
        </Dropdown.Item>
        <Dropdown.Item asChild>
          <Link to="/billing" className="flex items-center gap-2">
            <CreditCard className="size-3.5" />
            <span>Billing & Plan</span>
          </Link>
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
