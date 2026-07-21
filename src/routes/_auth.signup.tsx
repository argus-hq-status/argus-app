import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { signupFn, getSession, useAuth } from "../lib/auth-context";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { GithubLogo, CaretRight } from "@phosphor-icons/react";

export const Route = createFileRoute("/_auth/signup")({
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signupFn({ data: { email, password, name: "" } });
      const session = await getSession();
      setAuth({ ...session, loading: false });
      navigate({ to: "/monitors" });
    } catch {
      setError("Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="relative flex h-full w-full flex-col justify-center p-8 sm:p-12">
      <div className="absolute right-8 top-8 text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>

      <div className="mb-8 mt-12 flex flex-col">
        <h1 className="text-3xl font-medium tracking-tight text-gray-900 dark:text-gray-50">
          Create an account
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Sign up to get started with ArgusHQ
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="h-11"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        
        <Button 
          type="submit" 
          loading={loading}
          className="mt-8 flex h-11 w-full items-center justify-center gap-2 font-normal"
        >
          Continue <CaretRight className="size-3.5" weight="bold" />
        </Button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-400 dark:bg-[#1a1a1a] dark:text-gray-500">OR</span>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <Button
          type="button"
          variant="neutral"
          mode="stroke"
          onClick={() => { window.location.href = "/api/auth/github/login"; }}
          className="flex h-11 w-full items-center justify-center gap-2"
        >
          <GithubLogo className="size-5" weight="fill" />
          <span>Continue with GitHub</span>
        </Button>

        <div className="relative w-full">
          <Button 
            type="button" 
            variant="neutral"
            mode="stroke"
            className="flex h-11 w-full items-center justify-center gap-2 border-gray-300 bg-white font-normal text-gray-700 hover:bg-gray-50 cursor-not-allowed dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="size-5" />
            <span>Continue with Google</span>
          </Button>
          <span className="absolute -right-2 -top-2.5 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            Coming soon
          </span>
        </div>
      </div>

      <div className="fixed bottom-8 left-8 sm:bottom-12 sm:left-12 max-w-[360px] text-xs font-light text-gray-400 dark:text-gray-500">
        By creating an account, you agree to the{" "}
        <a href="#" className="font-normal text-gray-500 transition-colors hover:text-primary dark:text-gray-400">Terms of Service</a> and{" "}
        <a href="#" className="font-normal text-gray-500 transition-colors hover:text-primary dark:text-gray-400">Privacy Policy</a>
      </div>
    </Card>
  );
}
