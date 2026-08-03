import { Link, Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@clerk/tanstack-react-start";
import { redirectIfAuthenticatedFn } from "../lib/auth-server";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    await redirectIfAuthenticatedFn();
  },
  component: AuthLayout,
});

function AuthLayout() {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();

  // The server check can miss a session created moments ago, which would leave
  // an already-signed-in user staring at an empty Clerk card.
  const hasSession = isLoaded && isSignedIn;

  useEffect(() => {
    if (!hasSession) return;
    void navigate({ to: "/onboarding" });
  }, [hasSession, navigate]);

  return (
    <div
      className="relative isolate flex min-h-screen w-full flex-col overflow-hidden bg-[#063c38] bg-cover bg-center px-4 py-7 sm:px-6 sm:py-9"
      style={{ backgroundImage: "url('/images/AI_Bg_087.png')" }}
    >
      

      <header className="flex justify-center">
        <Link
          to="/login"
          className="flex items-center text-white"
          aria-label="Strauz"
        >
          <span className="text-xl font-semibold tracking-tight">Strauz</span>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center py-10 sm:py-14">
        <div className="auth-clerk w-full max-w-100">
          {hasSession ? (
            <div className="flex justify-center py-10">
              <span className="sr-only">Taking you to your workspace</span>
              <span className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </main>

      <footer className="flex justify-center">
        <nav className="flex items-center gap-2 text-xs text-white">
          <a href="https://argushq.com" className="transition hover:text-white">Strauz</a>
          <span aria-hidden="true">·</span>
          <a href="https://argushq.com/privacy" className="transition hover:text-white">Privacy</a>
          <span aria-hidden="true">·</span>
          <a href="https://argushq.com/terms" className="transition hover:text-white">Terms</a>
          <span aria-hidden="true">·</span>
          <a href="https://argushq.com/security" className="transition hover:text-white">Security</a>
        </nav>
      </footer>
    </div>
  );
}
