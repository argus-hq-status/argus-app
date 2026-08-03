import { useAuth } from "@clerk/tanstack-react-start";
import { useEffect } from "react";
import { setTokenGetter } from "./api";

export function ApiAuthBridge({ children }: { children: React.ReactNode }) {
  const { getToken, isLoaded, orgId } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    // Always mint a fresh token. Clerk caches the session token from sign-in,
    // so it would otherwise lack the org claim right after that org becomes
    // active (e.g. during onboarding), and the engine rejects org-less tokens.
    // Scope to the active org (when known) so the `org_id` claim is present.
    setTokenGetter((organizationId) =>
      getToken({ skipCache: true, organizationId: organizationId ?? orgId ?? undefined }),
    );
  }, [getToken, isLoaded, orgId]);

  return <>{children}</>;
}
