import { Outlet, createFileRoute, Link, useLocation, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Monitor, WarningCircle, StackSimple, Bell, CreditCard,
  GearSix, SignOut, User, Star, Circle,
} from "@phosphor-icons/react";
import { cn } from "../lib/utils";
import { getSession, useAuth } from "../lib/auth-context";
import { Avatar } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import * as Dropdown from "../components/ui/dropdown";
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

function DashboardLayout() {
  return (
    <LayoutProvider>
      <DashboardShell />
    </LayoutProvider>
  );
}

function DashboardShell() {
  const pathname = useLocation().pathname;
  useHeader();
  useAuth();
  const [plan, setPlan] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/billing/plan", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setPlan(data.plan))
      .catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-border bg-card">
        <div className="flex h-14 items-center gap-2.5 border-b border-border px-5">
          <img src="/images/logo.svg" alt="ArgusHQ" className="size-8" />
          <Link to="/monitors" className="text-sm font-semibold text-card-foreground">
            ArgusHQ
          </Link>
        </div>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 pb-4 pt-5">
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              Main
            </div>
            <div className="space-y-1">
              {mainNavItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    to={href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition duration-200 ease-out",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-card-foreground",
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />
                    )}
                    <Icon className="size-5 shrink-0" weight={isActive ? "bold" : "regular"} />
                    <span className={cn(isActive && "font-medium")}>{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <div className="px-3 pb-1 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              Workspace
            </div>
            <div className="space-y-1">
              {workspaceNavItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    to={href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition duration-200 ease-out",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-card-foreground",
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary" />
                    )}
                    <Icon className="size-5 shrink-0" weight={isActive ? "bold" : "regular"} />
                    <span className={cn(isActive && "font-medium")}>{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-border p-4">
          <UserDropdown plan={plan} />
        </div>
      </aside>

      <main className="ml-64 flex-1">
        <Header />
        <div className="px-8 pb-8 pt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function Header() {
  const { config } = useHeader();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-8 backdrop-blur-sm">
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
      <Dropdown.Trigger className="flex w-full items-center gap-3 rounded-lg p-2 transition hover:bg-muted">
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
          <Circle className="size-2.5 fill-current text-muted-foreground" />
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
