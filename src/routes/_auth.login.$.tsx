import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@clerk/tanstack-react-start";
import { clerkSignInAppearance } from "../lib/clerk-auth-appearance";

// Clerk also uses nested URLs for verification and password-reset steps.
export const Route = createFileRoute("/_auth/login/$")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <SignIn
      routing="path"
      path="/login"
      signUpUrl="/signup"
      // Everyone lands on /onboarding, which forwards members on to /monitors.
      // Sending people straight to the dashboard risks bouncing them back here,
      // because /monitors is gated on having an organization.
      forceRedirectUrl="/onboarding"
      appearance={clerkSignInAppearance}
    />
  );
}
