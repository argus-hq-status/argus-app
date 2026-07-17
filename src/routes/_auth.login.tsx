import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { loginFn, getSession, useAuth } from "../lib/auth-context";
import { Button } from "../components/ui/button";

export const Route = createFileRoute("/_auth/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await loginFn({ data: { email, password } });
      const session = await getSession();
      setAuth({ ...session, loading: false });
      navigate({ to: "/monitors" });
    } catch {
      setError("Invalid email or password");
    }
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="mb-2 text-2xl font-semibold text-gray-900">Sign in</h1>
      <p className="mb-8 text-sm text-gray-500">Enter your credentials to continue</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full">Sign in</Button>
      </form>
    </div>
  );
}
