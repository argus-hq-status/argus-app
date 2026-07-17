"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AuthHeader() {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  return (
    <header className="flex h-16 w-full max-w-6xl items-center justify-between px-6">
      <Link href="/login" className="flex items-center gap-2.5">
        <img src="/images/logo.svg" alt="ArgusHQ" className="size-8" />
        <span className="text-sm font-semibold text-card-foreground">ArgusHQ</span>
      </Link>
      <Link href={isLogin ? "/signup" : "/login"}>
        <Button variant="primary" size="sm">
          {isLogin ? "Create Account" : "Sign In"}
        </Button>
      </Link>
    </header>
  );
}
