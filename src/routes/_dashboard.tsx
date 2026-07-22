import { Outlet, createFileRoute, Link, useLocation, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Monitor,
  WarningCircle,
  StackSimple,
  Bell,
  CreditCard,
  GearSix,
  SignOut,
  User,
  Star,
  CaretLeft,
  CaretRight,
  CaretDown,
  MagnifyingGlass,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from "@phosphor-icons/react";
import { cn } from "../lib/utils";
import { getSession, useAuth } from "../lib/auth-context";
import { Avatar } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import * as Dropdown from "../components/ui/dropdown";
import { api } from "../lib/api";
import { LayoutProvider, useHeader } from "../components/layout-context";
import { Button } from "../components/ui/button";

export const Route = createFileRoute("/_dashboard")({
  beforeLoad: async () => {
    const session = await getSession();
    if (!session.user) throw redirect({ to: "/login" });
  },
  component: DashboardLayout,
});

const mainNavItems = [
  { href: "/monitors", label: "Monitors", icon: Monitor },
  { href: "/incidents", label: "Incidents", icon: WarningCircle },
  { href: "/status-pages", label: "Status Pages", icon: StackSimple },
  { href: "/alert-channels", label: "Alert Channels", icon: Bell },
];

const workspaceNavItems = [
  { href: "/billing", label: "Billing", icon: CreditCard },
];

const SIDEBAR_WIDTH = "13.75rem";
const SIDEBAR_WIDTH_ICON = "3.25rem";

function DashboardLayout() {
  return (
    <LayoutProvider>
      <DashboardShell />
    </LayoutProvider>
  );
}

function DashboardShell() {
  const pathname = useLocation().pathname;
  useAuth();
  const [plan, setPlan] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const { config } = useHeader();

  useEffect(() => {
    api("/api/billing/plan")
      .then((res) => res.json())
      .then((data) => setPlan(data.plan))
      .catch(() => {});
  }, []);

  return (
    <div
      className="flex h-svh max-h-svh overflow-hidden bg-shell font-sans text-sm text-foreground antialiased selection:bg-primary/20"
      style={
        {
          "--sidebar-width": collapsed ? SIDEBAR_WIDTH_ICON : SIDEBAR_WIDTH,
        } as React.CSSProperties
      }
    >
      {/* APP SIDEBAR (Athena V2 Style) */}
      <aside
        className={cn(
          "flex flex-col shrink-0 bg-shell transition-[width] duration-200 ease-linear select-none",
          collapsed ? "w-[3.25rem]" : "w-[13.75rem]",
        )}
      >
        {/* Header: Logo & Workspace Selector */}
        <div className="flex flex-col gap-2 p-2.5">
          <div
            className={cn(
              "flex items-center gap-2 px-1 py-1",
              collapsed && "justify-center px-0",
            )}
          >
            {/* Athena Style Logo */}
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
              <ShieldCheck className="size-4" weight="bold" />
            </div>
            {!collapsed && (
              <span className="text-sm font-semibold tracking-tight text-foreground">
                ArgusHQ
              </span>
            )}
          </div>

          {/* Client / Workspace Selector Button */}
          {!collapsed && (
            <Dropdown.Root>
              <Dropdown.Trigger className="flex w-full items-center justify-between rounded-md border border-border/60 bg-card px-2 py-1 text-xs text-card-foreground shadow-2xs hover:bg-muted/60 transition outline-none">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="size-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="truncate font-medium text-[11px]">Production Org</span>
                </div>
                <CaretDown className="size-3 text-muted-foreground shrink-0" />
              </Dropdown.Trigger>
              <Dropdown.Content side="bottom" align="start" className="w-52">
                <Dropdown.Label>Workspaces</Dropdown.Label>
                <Dropdown.Separator />
                <Dropdown.Item>
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-emerald-500" />
                    <span>Production Org</span>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item>
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-amber-500" />
                    <span>Staging Org</span>
                  </div>
                </Dropdown.Item>
              </Dropdown.Content>
            </Dropdown.Root>
          )}
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-2 py-2">
          {/* Main Section */}
          <div>
            {!collapsed && (
              <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Main
              </div>
            )}
            <nav className="space-y-0.5">
              {mainNavItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    to={href}
                    className={cn(
                      "group relative flex items-center gap-2.5 rounded-md text-xs transition duration-150 ease-out",
                      collapsed ? "justify-center px-0 py-2" : "px-2.5 py-1.5",
                      isActive
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                    title={collapsed ? label : undefined}
                  >
                    <Icon
                      className={cn(
                        "size-4 shrink-0",
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                      )}
                      weight={isActive ? "bold" : "regular"}
                    />
                    {!collapsed && <span>{label}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Workspace Section */}
          <div>
            {!collapsed && (
              <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Workspace
              </div>
            )}
            <nav className="space-y-0.5">
              {workspaceNavItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    to={href}
                    className={cn(
                      "group relative flex items-center gap-2.5 rounded-md text-xs transition duration-150 ease-out",
                      collapsed ? "justify-center px-0 py-2" : "px-2.5 py-1.5",
                      isActive
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                    title={collapsed ? label : undefined}
                  >
                    <Icon
                      className={cn(
                        "size-4 shrink-0",
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                      )}
                      weight={isActive ? "bold" : "regular"}
                    />
                    {!collapsed && <span>{label}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-2 border-t border-border/40 flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center justify-between w-full">
              <UserDropdown plan={plan} />
              <button
                onClick={() => setCollapsed(true)}
                className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition"
                title="Collapse sidebar"
              >
                <CaretLeft className="size-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCollapsed(false)}
              className="flex w-full items-center justify-center p-2 rounded-md text-muted-foreground hover:bg-muted transition"
              title="Expand sidebar"
            >
              <CaretRight className="size-3.5" />
            </button>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT INSET (Athena V2 Style: p-2 pl-1.5) */}
      <main className="min-h-0 flex-1 flex flex-col overflow-hidden bg-shell p-2 pl-1.5 gap-2">
        {/* TOP HEADER (Outside main content panel) */}
        <header className="flex shrink-0 items-center justify-between px-1">
          <div /> {/* Left spacer */}
          <div className="flex items-center gap-1.5">
            <Button variant="neutral" mode="stroke" size="xs" className="w-48 justify-start text-muted-foreground px-2 font-normal">
              <MagnifyingGlass className="size-3.5" />
              <span>Search...</span>
            </Button>
            {config.actions}
          </div>
        </header>

        {/* MAIN CONTENT PANEL */}
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[10px] bg-background">
          {/* ATHENA STYLE PAGE HEADER (No bottom border) */}
          <header className="flex shrink-0 items-center justify-between gap-4 bg-background px-5 py-3.5">
            {/* Title / Breadcrumb & Icon Badge */}
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted/80 ring-1 ring-inset ring-border/50 text-foreground">
                <Monitor className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex flex-col gap-0.5">
                <HeaderBreadcrumb title={config.title} />
                {config.description && (
                  <p className="truncate text-[11px] text-muted-foreground">
                    {config.description}
                  </p>
                )}
              </div>
            </div>
            
            {/* Right side spacer if needed, actions moved up */}
            <div />
          </header>

          {/* PAGE CONTENT CONTAINER */}
          <div className="flex-1 min-h-0 overflow-y-auto p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

function HeaderBreadcrumb({ title }: { title: string }) {
  const { config } = useHeader();
  const pathname = useLocation().pathname;
  const segments = pathname.split("/").filter(Boolean);

  if (config.breadcrumb && config.breadcrumb.length > 0) {
    return (
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm font-semibold tracking-tight text-foreground">
        {config.breadcrumb.map((crumb, idx) => (
          <span key={crumb.label} className="flex items-center gap-1">
            {idx > 0 && <ArrowRight className="size-3 text-muted-foreground/60" />}
            {crumb.href ? (
              <Link to={crumb.href} className="text-muted-foreground hover:text-foreground transition">
                {crumb.label}
              </Link>
            ) : (
              <span>{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-sm font-semibold tracking-tight text-foreground">
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;
        const label = seg.charAt(0).toUpperCase() + seg.slice(1);
        return (
          <span key={seg} className="flex items-center gap-1">
            {i > 0 && <ArrowRight className="size-3 text-muted-foreground/60" />}
            <span className={isLast ? "text-foreground font-semibold" : "text-muted-foreground font-normal"}>
              {label}
            </span>
          </span>
        );
      })}
    </div>
  );
}

function UserDropdown({ plan }: { plan: string | null }) {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger className="flex items-center gap-1.5 rounded-md p-1 text-xs text-foreground transition hover:bg-muted/70 min-w-0 outline-none">
        <Avatar size="sm" className="size-5 text-[9px]" />
        <div className="flex flex-col text-left min-w-0">
          <span className="font-medium truncate text-[11px]">User</span>
          <span className="text-[9px] text-muted-foreground">{plan ?? "Free Plan"}</span>
        </div>
      </Dropdown.Trigger>
      <Dropdown.Content side="top" align="start" className="w-52">
        <Dropdown.Label>User Account</Dropdown.Label>
        <Dropdown.Separator />
        <Dropdown.Item asChild>
          <Link to="/billing" className="flex items-center gap-2">
            <CreditCard className="size-3.5" />
            <span>Billing & Plan</span>
          </Link>
        </Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item
          onSelect={async () => {
            await api("/api/auth/logout", { method: "POST" });
            window.location.href = "/login";
          }}
          className="text-error"
        >
          <SignOut className="size-3.5" />
          <span>Sign Out</span>
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
