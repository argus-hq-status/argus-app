import { Outlet, createFileRoute, Link, useLocation, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Monitor, WarningCircle, StackSimple, Bell, CreditCard,
  GearSix, SignOut, User, Star, List, CaretRight, MagnifyingGlass,
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

const otherNavItems = [
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
    <div className="flex h-screen w-full flex-col bg-[#fbfbfb] text-[#1f1f1f] antialiased select-none font-sans text-xs">
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT NAV SIDEBAR */}
        <aside className={cn(
          "shrink-0 border-r border-[#e8e8e8] bg-[#f7f7f8] flex flex-col justify-between transition-all duration-200 ease-linear",
          collapsed ? "w-16" : "w-56",
        )}>
          <div className="flex flex-col">
            {/* Top Bar */}
            <div className="p-3 pb-2 space-y-3 border-b border-[#ececec]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer hover:bg-black/5 p-1 rounded transition">
                  <div className="size-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-[11px] font-bold">
                    A
                  </div>
                  {!collapsed && (
                    <>
                      <span className="font-semibold text-xs text-[#111]">ArgusHQ</span>
                      <CaretRight className="size-3 text-[#777]" />
                    </>
                  )}
                </div>
                {!collapsed && (
                  <div className="flex items-center gap-1 text-[#666]">
                    <button className="p-1 hover:bg-black/5 rounded transition">
                      <MagnifyingGlass className="size-3.5" />
                    </button>
                    <button
                      onClick={() => setCollapsed(true)}
                      className="p-1 hover:bg-black/5 rounded transition"
                    >
                      <List className="size-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="p-3 space-y-4 overflow-y-auto">
              {/* Main Nav */}
              <div>
                {!collapsed && (
                  <div className="px-2 pb-1.5 text-[10px] font-semibold text-[#888] uppercase tracking-wider">
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
                          "w-full flex items-center gap-2.5 rounded-md text-xs font-medium transition",
                          collapsed ? "justify-center px-0 py-2" : "px-2.5 py-1.5",
                          isActive
                            ? "bg-[#e8ebf0] text-[#1c4ed8]"
                            : "text-[#444] hover:bg-black/5",
                        )}
                        title={collapsed ? label : undefined}
                      >
                        <Icon className={cn("size-4", isActive ? "text-[#1c4ed8]" : "text-[#666]")} />
                        {!collapsed && <span>{label}</span>}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Other Nav */}
              <div>
                {!collapsed && (
                  <div className="px-2 pb-1.5 text-[10px] font-semibold text-[#888] uppercase tracking-wider">
                    Other
                  </div>
                )}
                <nav className="space-y-0.5">
                  {otherNavItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname.startsWith(href);
                    return (
                      <Link
                        key={href}
                        to={href}
                        className={cn(
                          "w-full flex items-center gap-2.5 rounded-md text-xs font-medium transition",
                          collapsed ? "justify-center px-0 py-2" : "px-2.5 py-1.5",
                          isActive
                            ? "bg-[#e8ebf0] text-[#1c4ed8]"
                            : "text-[#444] hover:bg-black/5",
                        )}
                        title={collapsed ? label : undefined}
                      >
                        <Icon className={cn("size-4", isActive ? "text-[#1c4ed8]" : "text-[#666]")} />
                        {!collapsed && <span>{label}</span>}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Bottom: User */}
          <div className="border-t border-[#ececec] p-3">
            {collapsed ? (
              <button
                onClick={() => setCollapsed(false)}
                className="flex w-full items-center justify-center rounded-md p-2 text-[#444] hover:bg-black/5 transition"
              >
                <CaretRight className="size-4" />
              </button>
            ) : (
              <UserDropdown plan={plan} />
            )}
          </div>
        </aside>

        {/* RIGHT CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Thin Header Bar */}
          <header className="h-11 border-b border-[#e9e9e9] px-4 flex items-center justify-between shrink-0 bg-[#fafafa]">
            <HeaderBreadcrumb />
            <HeaderActions />
          </header>

          {/* Content Panel */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            <div className="min-h-0 flex-1 overflow-auto">
              <div className="flex w-full flex-col gap-8 px-5 py-8">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeaderBreadcrumb() {
  const { config } = useHeader();
  const pathname = useLocation().pathname;
  const segments = pathname.split("/").filter(Boolean);
  return (
    <div className="flex items-center gap-2 text-xs">
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;
        const label = seg.charAt(0).toUpperCase() + seg.slice(1);
        return (
          <span key={seg} className="flex items-center gap-2">
            {i > 0 && <span className="text-[#ccc]">/</span>}
            <span className={isLast ? "font-semibold text-[#111]" : "text-[#888] hover:underline cursor-pointer"}>
              {label}
            </span>
          </span>
        );
      })}
      {config.breadcrumb?.map((item) => (
        <span key={item.label} className="flex items-center gap-2">
          <span className="text-[#ccc]">/</span>
          <span className="font-semibold text-[#111]">{item.label}</span>
        </span>
      ))}
    </div>
  );
}

function HeaderActions() {
  const { config } = useHeader();
  return (
    <div className="flex items-center gap-2 text-[#555]">
      {config.description && (
        <span className="text-xs text-[#888] mr-2">{config.description}</span>
      )}
      {config.actions}
    </div>
  );
}

function UserDropdown({ plan }: { plan: string | null }) {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger className="flex w-full items-center gap-3 rounded-md p-2 transition hover:bg-black/5">
        <Avatar size="sm" />
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#222] truncate">User</span>
            <Star className="size-3 shrink-0 fill-amber-400 text-amber-400" weight="fill" />
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="light" color="blue" size="sm">{plan ?? "Free"}</Badge>
          </div>
        </div>
        <List className="size-3 shrink-0 text-[#777]" />
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
