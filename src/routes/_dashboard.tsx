import "@fontsource-variable/geist";
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
  X,
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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
    <div className="dashboard-shell flex h-svh max-h-svh overflow-hidden bg-shell font-dashboard text-sm text-foreground antialiased">
      {mobileNavOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-black/55 backdrop-blur-[2px] md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-60 shrink-0 -translate-x-full select-none flex-col border-r border-border bg-background transition-[width,transform] duration-200 [transition-timing-function:cubic-bezier(0.2,0,0,1)] md:static md:translate-x-0",
          mobileNavOpen && "translate-x-0",
          collapsed ? "md:w-17" : "md:w-60",
        )}
      >
        {/* Workspace Top Bar */}
        <div className={cn("flex min-h-14 items-center border-b border-border px-3", collapsed ? "md:justify-center" : "justify-between")}>
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
                      "w-full justify-between rounded-lg border-0 bg-transparent py-1.5 pl-1 pr-8 text-sm font-semibold !text-foreground hover:bg-muted [&_*]:!text-foreground",
                    organizationSwitcherTriggerIcon: "hidden",
                    organizationSwitcherTrigger__organizationName:
                      "!text-foreground",
                    organizationSwitcherTriggerOrganizationPreviewName:
                      "!text-foreground",
                    organizationSwitcherTriggerOrganizationPreviewTextContainer:
                      "!text-foreground",
                    organizationPreviewMainIdentifier: "!text-foreground",
                    organizationPreviewSecondaryIdentifier: "!text-muted-foreground",
                    organizationSwitcherPopoverCard: "border border-border bg-surface-raised text-foreground",
                    organizationSwitcherPopoverActionButton: "text-foreground hover:bg-muted",
                  },
                }}
              />
              <span className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 flex-col text-muted-foreground">
                <CaretUp className="size-2.5" weight="fill" />
                <CaretDown className="-mt-1 size-2.5" weight="fill" />
              </span>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="ml-1 hidden size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground md:flex"
              aria-label="Collapse sidebar"
            >
              <SidebarSimple className="size-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            className="ml-1 flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground md:hidden"
            aria-label="Close navigation"
          >
            <X className="size-4" />
          </button>
        </div>

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="mx-auto mb-2 hidden size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground md:flex"
            aria-label="Expand sidebar"
          >
            <CaretRight className="size-4" />
          </button>
        )}

        {/* Main Nav Items */}
        <nav className="space-y-1 px-3 py-3">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/"
                ? pathname === "/" || pathname === ""
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                to={href}
                onClick={() => setMobileNavOpen(false)}
                title={collapsed ? label : undefined}
                className={cn(
                  "flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-[0.8125rem] font-medium transition-colors duration-150",
                  collapsed && "justify-center px-0",
                  isActive
                    ? "bg-primary-muted font-semibold text-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--primary)_12%,transparent)]"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon
                  className={cn("size-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")}
                  weight={isActive ? "bold" : "regular"}
                />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Recent Section */}
        {!collapsed && (
          <div className="mt-3 px-3">
            <div className="flex items-center justify-between px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-text-soft">
              <span>Recent</span>
              <div className="flex items-center gap-1">
                <button className="flex size-7 items-center justify-center rounded-md transition-colors duration-150 hover:bg-muted hover:text-foreground" title="Search" aria-label="Search recent alerts">
                  <MagnifyingGlass className="size-3.5" />
                </button>
                <button className="flex size-7 items-center justify-center rounded-md transition-colors duration-150 hover:bg-muted hover:text-foreground" title="Filter" aria-label="Filter recent alerts">
                  <SlidersHorizontal className="size-3.5" />
                </button>
              </div>
            </div>
            <div className="px-2.5 py-2 text-xs text-text-soft">No active alerts</div>
          </div>
        )}

        {/* Argus Onboarding / Getting Started Widget */}
        {!collapsed && showGettingStarted && (
          <div className="mx-3 mb-3 mt-4 rounded-xl bg-card p-3 text-xs shadow-[inset_0_0_0_1px_var(--border)]">
            <div className="flex items-center justify-between font-medium text-foreground">
              <span>Getting started</span>
              <button
                onClick={() => setShowGettingStarted(false)}
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
                title="Minimize"
              >
                <Minus className="size-3.5" />
              </button>
            </div>

            {/* Dynamic Progress bar */}
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <div className="mr-2 h-1 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500 [transition-timing-function:cubic-bezier(0.2,0,0,1)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] tabular-nums">{progressPercent}%</span>
            </div>

            {/* Checklist with Completed Checkmarks */}
            <div className="mt-3 space-y-2 text-[11px]">
              {onboardingSteps.map(({ label, href, completed }) => (
                <Link
                  key={label}
                  to={href}
                  className="flex items-center gap-2 text-muted-foreground transition-colors duration-150 hover:text-primary"
                >
                  {completed ? (
                    <CheckCircle className="size-3.5 text-emerald-400 shrink-0" weight="fill" />
                  ) : (
                    <Circle className="size-3.5 shrink-0 text-text-soft" />
                  )}
                  <span className={cn("truncate", completed && "text-foreground line-through opacity-70")}>
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
              className="flex h-8 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-xs font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
            >
              <Gear className="size-4 shrink-0" />
              <span>Settings</span>
            </button>
            <a
              href="#"
              className="flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
            >
              <Question className="size-4 shrink-0" />
              <span>Help</span>
            </a>

            {/* Resources (Active style with blue ring and blue dot as in reference) */}
            <a
              href="#"
              className="flex h-8 items-center justify-between rounded-lg bg-primary-muted px-2.5 text-xs font-semibold text-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--primary)_15%,transparent)] transition-colors duration-150 hover:bg-primary/15"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="size-4 shrink-0" />
                <span>Resources</span>
              </div>
              <span className="size-1.5 rounded-full bg-primary" />
            </a>
          </div>
        )}

        {/* Footer & User Profile */}
        <div className="mt-auto shrink-0 border-t border-border p-3">
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
      <main className="min-h-0 min-w-0 flex-1">
        <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 md:hidden">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
              aria-label="Open navigation"
            >
              <SidebarSimple className="size-4" />
            </button>
            <span className="text-sm font-semibold tracking-[-0.02em]">Argus</span>
            <ThemeSwitcher />
          </header>
          <div className="dashboard-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 md:px-8 md:py-7 xl:px-10">
            <div className="mx-auto w-full max-w-[1440px]">
              <Outlet />
            </div>
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
      <Dropdown.Trigger className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left outline-none transition-colors duration-150 hover:bg-muted">
        <UserButton />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-xs font-semibold text-foreground">
              {displayName}
            </span>
            {isPro && (
              <Badge variant="light" color="green" size="sm" className="px-1.5 py-0 text-[10px]">
                PRO
              </Badge>
            )}
          </div>
          <span className="truncate text-[11px] text-muted-foreground">
            {plan ?? "free"} plan
          </span>
        </div>
        <CaretDown className="size-3 shrink-0 text-text-soft" />
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
