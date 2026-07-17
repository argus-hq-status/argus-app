"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Monitor,
  WarningCircle,
  StackSimple,
  Bell,
  CreditCard,
  GearSix,
  BellSimple,
  SignOut,
  User,
  Moon,
  Sun,
  Circle,
  Star,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { apiUrl } from "@/lib/api";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import * as Dropdown from "@/components/ui/dropdown";
import { LayoutProvider, useHeader } from "@/components/layout-context";
import { Breadcrumb } from "@/components/breadcrumb";
import { Toaster } from "@/components/ui/toaster";

const mainNavItems = [
  { href: "/monitors", label: "Monitors", icon: Monitor },
  { href: "/incidents", label: "Incidents", icon: WarningCircle },
  { href: "/status-pages", label: "Status Pages", icon: StackSimple },
  { href: "/alert-channels", label: "Alert Channels", icon: Bell },
];

const workspaceNavItems = [
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: GearSix },
];

function UserDropdown({ plan }: { plan: string | null }) {
  const { data: session } = useSession();
  const [theme, setTheme] = useState<"dark" | "light">("light");

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(next);
  };

  return (
    <Dropdown.Root>
      <Dropdown.Trigger className="flex w-full items-center gap-3 whitespace-nowrap rounded-10 p-3 text-left outline-none transition hover:bg-muted focus:outline-none">
        <Avatar
          initials={
            session?.user?.name
              ? session.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "U"
          }
          size="md"
        />
        <div className="flex w-[172px] shrink-0 items-center gap-3">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-card-foreground">
                {session?.user?.name ?? "User"}
              </span>
              {plan === "pro" && (
                <Badge variant="light" color="gray" size="sm">Pro</Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {session?.user?.email ?? "user@argushq.com"}
            </div>
          </div>
          <div className="flex size-6 items-center justify-center rounded-md">
            <Circle className="size-2.5 fill-current text-muted-foreground" />
          </div>
        </div>
      </Dropdown.Trigger>
      <Dropdown.Content side="right" sideOffset={24} align="end">
        <Dropdown.Item onSelect={toggleTheme}>
          {theme === "dark" ? (
            <Sun className="size-5 text-muted-foreground" />
          ) : (
            <Moon className="size-5 text-muted-foreground" />
          )}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </Dropdown.Item>
        <Dropdown.Separator className="-mx-1 my-1 h-px bg-border" />
        <Dropdown.Group>
          <Dropdown.Item asChild>
            <Link href="/settings">
              <User className="size-5 text-muted-foreground" />
              Profile
            </Link>
          </Dropdown.Item>
          <Dropdown.Item asChild>
            <Link href="/settings">
              <GearSix className="size-5 text-muted-foreground" />
              Settings
            </Link>
          </Dropdown.Item>
        </Dropdown.Group>
        <Dropdown.Separator className="-mx-1 my-1 h-px bg-border" />
        <Dropdown.Item onSelect={() => signOut({ callbackUrl: "/login" })}>
          <SignOut className="size-5 text-muted-foreground" />
          Logout
        </Dropdown.Item>
        <div className="p-2 text-xs text-muted-foreground">v.0.1.0</div>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { config } = useHeader();
  const [plan, setPlan] = useState<string | null>(null);

  useEffect(() => {
    fetch(apiUrl("/api/billing/plan"))
      .then((res) => res.json())
      .then((data) => setPlan(data.plan))
      .catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-border bg-card">
        <div className="flex h-14 items-center gap-2.5 border-b border-border px-5">
          <img src="/images/logo.svg" alt="ArgusHQ" className="size-8" />
          <Link
            href="/monitors"
            className="text-sm font-semibold text-card-foreground"
          >
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
                    href={href}
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
                    <Icon
                      className="size-5 shrink-0"
                      weight={isActive ? "bold" : "regular"}
                    />
                    <span className={cn(isActive && "font-medium")}>
                      {label}
                    </span>
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
                    href={href}
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
                    <Icon
                      className="size-5 shrink-0"
                      weight={isActive ? "bold" : "regular"}
                    />
                    <span className={cn("flex-1", isActive && "font-medium")}>
                      {label}
                    </span>
                    {href === "/billing" && plan === "pro" && (
                      <Badge variant="light" color="gray" size="sm">Pro</Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <div className="px-3 pb-1 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              Favorites
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground">
                <Star className="size-4 shrink-0" />
                <span>Star items to pin them here</span>
              </div>
            </div>
          </div>
        </div>

        <Divider className="mx-4" />
        <div className="p-2">
          <UserDropdown plan={plan} />
        </div>
      </aside>

      <Toaster />

      <div className="flex flex-1 flex-col pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="flex min-h-16 items-center justify-between px-6">
            <div className="flex flex-col gap-0.5">
              {config?.breadcrumb && config?.breadcrumb?.length > 0 ? (
                <Breadcrumb items={config.breadcrumb} />
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              {config.actions}
              <button
                type="button"
                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-card-foreground"
              >
                <BellSimple className="size-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutProvider>
      <DashboardShell>{children}</DashboardShell>
    </LayoutProvider>
  );
}
