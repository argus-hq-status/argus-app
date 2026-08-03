import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@clerk/tanstack-react-start";
import { clerkSignInAppearance } from "../lib/clerk-auth-appearance";

// Keep the base URL as a first-class route for typed links. The sibling
// `_auth.login.$.tsx` route handles Clerk's nested verification paths.
export const Route = createFileRoute("/_auth/login")({
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
