import { createFileRoute } from "@tanstack/react-router";
import { SignUp } from "@clerk/tanstack-react-start";
import { clerkSignUpAppearance } from "../lib/clerk-auth-appearance";

// Clerk progresses through nested URLs while collecting verification details.
// The catch-all keeps those internal paths inside our custom sign-up page.
export const Route = createFileRoute("/_auth/signup/$")({
  component: SignupPage,
});

function SignupPage() {
  return (
    <SignUp
      routing="path"
      path="/signup"
      signInUrl="/login"
      forceRedirectUrl="/onboarding"
      appearance={clerkSignUpAppearance}
    />
  );
}
