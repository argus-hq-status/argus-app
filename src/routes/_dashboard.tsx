import { Outlet, createFileRoute, Link, useLocation, redirect } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
import {
  Monitor, WarningCircle, StackSimple, Bell, CreditCard,
  GearSix, SignOut, User, Star, List, CaretLeft, CaretRight,
} from "@phosphor-icons/react";
import { cn } from "../lib/utils";
import { getSession, useAuth } from "../lib/auth-context";
import { Avatar } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import * as Dropdown from "../components/ui/dropdown";
import { api } from "../lib/api";
import { LayoutProvider, useHeader } from "../components/layout-context";

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
const SIDEBAR_WIDTH_ICON = "3rem";

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

  useEffect(() => {
    api("/api/billing/plan")
      .then((res) => res.json())
      .then((data) => setPlan(data.plan))
      .catch(() => {});
  }, []);

  return (
    <div
      className="flex h-svh max-h-svh overflow-hidden bg-shell"
      style={{ "--sidebar-width": collapsed ? SIDEBAR_WIDTH_ICON : SIDEBAR_WIDTH } as React.CSSProperties}
    >
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-card transition-[width] duration-200 ease-linear",
          collapsed ? "w-[3rem]" : "w-[13.75rem]",
        )}
      >
        <div className={cn("flex h-14 items-center border-b border-border", collapsed ? "justify-center" : "gap-2.5 px-5")}>
          <div className="flex size-8 items-center justify-center rounded bg-primary text-sm font-bold text-primary-foreground">
            A
          </div>
          {!collapsed && (
            <Link to="/monitors" className="text-sm font-semibold text-card-foreground">
              ArgusHQ
            </Link>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 pb-4 pt-5">
          {!collapsed && (
            <div className="px-1 pb-1 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              Main
            </div>
          )}
          <nav className="space-y-1">
            {mainNavItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  to={href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg text-sm transition duration-200 ease-out",
                    collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-card-foreground",
                  )}
                  title={collapsed ? label : undefined}
                >
                  {isActive && !collapsed && (
                    <div className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />
                  )}
                  <Icon className="size-5 shrink-0" weight={isActive ? "bold" : "regular"} />
                  {!collapsed && <span className={cn(isActive && "font-medium")}>{label}</span>}
                </Link>
              );
            })}
          </nav>

          {!collapsed && (
            <div className="space-y-1">
              <div className="px-1 pb-1 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                Workspace
              </div>
              <nav className="space-y-1">
                {workspaceNavItems.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      to={href}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-lg text-sm transition duration-200 ease-out",
                        collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-card-foreground",
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />
                      )}
                      <Icon className="size-5 shrink-0" weight={isActive ? "bold" : "regular"} />
                      {!collapsed && <span className={cn(isActive && "font-medium")}>{label}</span>}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        <div className="border-t border-border p-3">
          {collapsed ? (
            <button
              onClick={() => setCollapsed(false)}
              className="flex w-full items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted"
            >
              <CaretRight className="size-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <UserDropdown plan={plan} />
              <button
                onClick={() => setCollapsed(true)}
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
              >
                <CaretLeft className="size-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      <div
        className="min-h-0 flex-1 overflow-hidden transition-[padding] duration-200 ease-linear"
        style={{ paddingLeft: collapsed ? SIDEBAR_WIDTH_ICON : SIDEBAR_WIDTH }}
      >
        <div className="flex h-full min-h-0 flex-col overflow-hidden p-2 pl-1.5">
          <MainContentPanel>
            <Header />
            <div className="min-h-0 flex-1 overflow-auto">
              <div className="flex w-full flex-col gap-8 px-5 py-8">
                <Outlet />
              </div>
            </div>
          </MainContentPanel>
        </div>
      </div>
    </div>
  );
}

function MainContentPanel({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[10px] bg-background">
      {children}
    </div>
  );
}

function Header() {
  const { config } = useHeader();
  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-dashed border-border/60 bg-background px-5 py-4">
      <div>
        <h1 className="text-lg font-semibold text-card-foreground">{config.title}</h1>
        {config.description && (
          <p className="text-sm text-muted-foreground">{config.description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {config.actions}
      </div>
    </header>
  );
}

function UserDropdown({ plan }: { plan: string | null }) {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger className="flex flex-1 items-center gap-3 rounded-lg p-2 transition hover:bg-muted">
        <Avatar size="sm" />
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-card-foreground">User</span>
            <Star className="size-3 fill-amber-400 text-amber-400" weight="fill" />
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="light" color="blue" size="sm">{plan ?? "Free"}</Badge>
          </div>
        </div>
        <div className="flex size-6 items-center justify-center rounded-md">
          <List className="size-2.5 fill-current text-muted-foreground" />
        </div>
      </Dropdown.Trigger>
      <Dropdown.Content side="right" sideOffset={24} align="end">
        <Dropdown.Item asChild>
          <button className="flex w-full items-center gap-3">
            <User className="size-5 text-muted-foreground" />
            Profile
          </button>
        </Dropdown.Item>
        <Dropdown.Item asChild>
          <button className="flex w-full items-center gap-3">
            <GearSix className="size-5 text-muted-foreground" />
            Settings
          </button>
        </Dropdown.Item>
        <Dropdown.Separator className="-mx-1 my-1 h-px bg-border" />
        <Dropdown.Item onClick={() => (window.location.href = "/login")}>
          <SignOut className="size-5 text-muted-foreground" />
          Logout
        </Dropdown.Item>
        <div className="p-2 text-xs text-muted-foreground">v.0.1.0</div>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
