import { createServerFn } from "@tanstack/react-start";
import { getRequest, setResponseHeader } from "@tanstack/react-start/server";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan?: string;
}

export interface AuthState {
  user: User | null;
  workspace: Workspace | null;
  loading: boolean;
}

export const getSession = createServerFn({ method: "GET" }).handler(async () => {
  const request = getRequest();
  const cookie = request?.headers.get("cookie") ?? "";
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { cookie },
  });
  if (!res.ok) return { user: null, workspace: null, loading: false } as AuthState;
  return res.json() as Promise<AuthState>;
});

export const loginFn = createServerFn({ method: "POST" })
  .validator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    const res = await fetch(`${API_URL}/api/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Invalid credentials");
    const engineSetCookie = res.headers.get("set-cookie");
    if (engineSetCookie) setResponseHeader("Set-Cookie", engineSetCookie);
    return res.json();
  });

export const signupFn = createServerFn({ method: "POST" })
  .validator((d: { email: string; password: string; name: string }) => d)
  .handler(async ({ data }) => {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Signup failed");
    const engineSetCookie = res.headers.get("set-cookie");
    if (engineSetCookie) setResponseHeader("Set-Cookie", engineSetCookie);
    return res.json();
  });

const AuthContext = createContext<{
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
}>({ auth: { user: null, workspace: null, loading: true }, setAuth: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ user: null, workspace: null, loading: true });

  const checkSession = useCallback(async () => {
    try {
      const data = await getSession();
      setAuth(data);
      if (!data.user && typeof window !== "undefined" && !window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/signup")) {
        window.location.href = "/login";
      }
    } catch {
      setAuth({ user: null, workspace: null, loading: false });
    }
  }, []);

  useEffect(() => {
    checkSession();

    const interval = setInterval(checkSession, 5 * 60 * 1000);

    const handleExpired = () => checkSession();
    window.addEventListener("auth:expired", handleExpired);

    return () => {
      clearInterval(interval);
      window.removeEventListener("auth:expired", handleExpired);
    };
  }, [checkSession]);

  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export async function fetchApi(path: string, options?: RequestInit): Promise<Response> {
  const url = `${API_URL}${path}`;
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
}
