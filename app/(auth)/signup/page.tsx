"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { GithubLogo } from "@phosphor-icons/react";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch(apiUrl("/api/auth/signup"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Registration failed");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      router.push("/login");
    } else {
      router.push("/monitors");
    }
  }

  async function handleGitHub() {
    await signIn("github", { callbackUrl: "/monitors" });
  }

  return (
    <div className="w-full max-w-sm px-4">
      <div className="rounded-2xl border border-stroke-soft bg-bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-text-strong">Create account</h1>
        <p className="mt-1 text-sm text-text-sub">Get started with ArgusHQ</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-text-strong">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full rounded-lg border border-stroke-soft bg-bg-white px-3 py-2 text-sm text-text-strong outline-none placeholder:text-text-soft focus:border-primary"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-text-strong">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-lg border border-stroke-soft bg-bg-white px-3 py-2 text-sm text-text-strong outline-none placeholder:text-text-soft focus:border-primary"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-text-strong">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg border border-stroke-soft bg-bg-white px-3 py-2 text-sm text-text-strong outline-none placeholder:text-text-soft focus:border-primary"
              placeholder="At least 8 characters, 1 uppercase, 1 number"
              required
              minLength={8}
            />
            <p className="mt-1 text-xs text-text-soft">
              Must be at least 8 characters, include an uppercase letter and a number
            </p>
          </div>

          {error && (
            <p className="text-sm text-error">{error}</p>
          )}

          <Button type="submit" variant="primary" className="w-full" loading={loading}>
            Create Account
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-stroke-soft" />
          <span className="text-xs text-text-soft">or</span>
          <div className="h-px flex-1 bg-stroke-soft" />
        </div>

        <Button
          variant="neutral"
          mode="stroke"
          className="w-full"
          icon={GithubLogo}
          onClick={handleGitHub}
        >
          Continue with GitHub
        </Button>
      </div>
    </div>
  );
}
