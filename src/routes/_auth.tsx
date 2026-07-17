import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "../lib/auth-context";
import AuthHeader from "../components/auth-header";
import AuthFooter from "../components/auth-footer";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    const session = await getSession();
    if (session.user) throw redirect({ to: "/monitors" });
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <AuthHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Outlet />
      </main>
      <AuthFooter />
    </div>
  );
}
