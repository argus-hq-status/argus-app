import { createFileRoute } from "@tanstack/react-router";
import { SignUp } from "@clerk/tanstack-react-start";
import { clerkSignUpAppearance } from "../lib/clerk-auth-appearance";

// Keep the base URL as a first-class route for typed links. The sibling
// `_auth.signup.$.tsx` route handles Clerk's nested verification paths.
export const Route = createFileRoute("/_auth/signup")({
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
