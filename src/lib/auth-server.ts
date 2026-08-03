import { createServerFn } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";
import { auth } from "@clerk/tanstack-react-start/server";

export const requireAuthFn = createServerFn({ method: "GET" }).handler(async () => {
  const { isAuthenticated, userId, orgId } = await auth();

  if (!isAuthenticated || !userId) {
    throw redirect({ to: "/login" });
  }

  // No organization yet means the user has not finished onboarding.
  if (!orgId) {
    throw redirect({ to: "/onboarding" });
  }

  return { userId, orgId };
});

export const redirectIfAuthenticatedFn = createServerFn({ method: "GET" }).handler(async () => {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) return;

  // The onboarding route distinguishes an active Clerk organization from a
  // completed setup, so every authenticated person passes through it first.
  throw redirect({ to: "/onboarding" });
});
