import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "../lib/auth-context";
import { ThemeSwitcher } from "../components/theme-switcher";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    const session = await getSession();
    if (session.user) throw redirect({ to: "/monitors" });
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-gray-50 dark:bg-[#111111] p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="flex flex-1 flex-col justify-start">
        <div className="flex size-12 items-center justify-center rounded bg-primary text-2xl font-medium text-primary-foreground">
          a
        </div>
      </div>
      <div className="flex w-full max-w-[480px] flex-col">
        <Outlet />
      </div>
      
      <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50">
        <ThemeSwitcher />
      </div>
    </div>
  );
}
