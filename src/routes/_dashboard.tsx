import { Outlet, createFileRoute, Link, useLocation, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Eye,
  Monitor,
  WarningCircle,
  StackSimple,
  Bell,
  CreditCard,
  SignOut,
  Plus,
  CaretRight,
  CaretDown,
  MagnifyingGlass,
  SidebarSimple,
} from "@phosphor-icons/react";
import { cn } from "../lib/utils";
import { getSession, useAuth } from "../lib/auth-context";
import { Avatar } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import * as Dropdown from "../components/ui/dropdown";
import { api } from "../lib/api";
import { ThemeSwitcher } from "../components/theme-switcher";
import { Input } from "../components/ui/input";

export const Route = createFileRoute("/_dashboard")({
  beforeLoad: async () => {
    const session = await getSession();
    if (!session.user) throw redirect({ to: "/login" });
  },
  component: DashboardLayout,
});

const navItems = [
  { href: "/monitors", label: "Monitors", icon: Monitor },
  { href: "/incidents", label: "Incidents", icon: WarningCircle },
  { href: "/status-pages", label: "Status Pages", icon: StackSimple },
  { href: "/alert-channels", label: "Alert Channels", icon: Bell },
  { href: "/billing", label: "Billing", icon: CreditCard },
];

function DashboardLayout() {
  return <DashboardShell />;
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
      .catch(() => { });
  }, []);

  const isPro = plan === "pro";

  return (
    <div className="flex h-svh max-h-svh overflow-hidden bg-[#f4f5f7] dark:bg-[#111111] font-sans text-sm text-foreground antialiased selection:bg-primary/20 transition-colors duration-300">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex shrink-0 flex-col transition-[width] duration-200 ease-linear select-none",
          collapsed ? "w-[68px]" : "w-[260px]",
        )}
      >
        {/* Logo + collapse */}
        <div className={cn("flex items-center p-4", collapsed ? "justify-center" : "justify-between")}>
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Eye className="size-5" weight="bold" />
          </div>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="flex size-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white hover:text-gray-700 dark:hover:bg-[#1a1a1a] dark:hover:text-gray-200"
              aria-label="Collapse sidebar"
            >
              <SidebarSimple className="size-4" />
            </button>
          )}
        </div>

        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="mx-auto mb-2 flex size-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white dark:hover:bg-[#1a1a1a]"
            aria-label="Expand sidebar"
          >
            <CaretRight className="size-4" />
          </button>
        )}

        {/* Search */}
        {!collapsed && (
          <div className="px-4 pb-3">
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search..."
                className="h-9 rounded-lg border-gray-200 bg-white pl-9 text-sm dark:border-[#2a2a2a] dark:bg-[#1a1a1a]"
                readOnly
              />
            </div>
          </div>
        )}

        {/* Quick action */}
        {!collapsed && (
          <div className="px-4 pb-4">
            <Link
              to="/monitors/new"
              className="flex items-center gap-2 text-sm font-medium text-primary transition hover:text-primary/80"
            >
              <Plus className="size-4" weight="bold" />
              New monitor
            </Link>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                to={href}
                title={collapsed ? label : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition",
                  collapsed && "justify-center px-0",
                  isActive
                    ? "bg-gray-200 font-medium text-gray-900 dark:bg-[#2a2a2a] dark:text-gray-50"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-[#1a1a1a] dark:hover:text-gray-50",
                )}
              >
                <Icon
                  className={cn("size-4 shrink-0", isActive ? "text-primary" : "text-gray-400")}
                  weight={isActive ? "fill" : "regular"}
                />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer: theme + user */}
        <div className="mt-auto border-t border-gray-200/80 p-3 dark:border-[#2a2a2a]">
          <div className={cn("mb-2 flex", collapsed ? "justify-center" : "justify-end px-1")}>
            <ThemeSwitcher />
          </div>
          {!collapsed ? (
            <UserDropdown plan={plan} isPro={isPro} />
          ) : (
            <div className="flex justify-center">
              <Avatar size="sm" className="size-8 text-[10px]" />
            </div>
          )}
        </div>
      </aside>

      {/* Main panel */}
      <main className="min-h-0 flex-1 p-3 pl-0">
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white dark:border-[#2a2a2a] dark:bg-[#1a1a1a]">
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

function UserDropdown({ plan, isPro }: { plan: string | null; isPro: boolean }) {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left transition hover:bg-gray-50 dark:hover:bg-[#222] outline-none">
        <Avatar size="sm" className="size-8 text-[10px]" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-50">User</span>
            {isPro && (
              <Badge variant="light" color="green" size="sm" className="text-[10px] px-1.5 py-0">
                PRO
              </Badge>
            )}
          </div>
          <span className="truncate text-xs text-gray-500 dark:text-gray-400">
            {plan ?? "free"} plan
          </span>
        </div>
        <CaretDown className="size-3 shrink-0 text-gray-400" />
      </Dropdown.Trigger>
      <Dropdown.Content side="top" align="start" className="w-56">
        <Dropdown.Label>Account</Dropdown.Label>
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
