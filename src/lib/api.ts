const API_URL =
  typeof window !== "undefined"
    ? ""
    : (process.env.API_URL ?? "http://localhost:4000");

type TokenGetter = (organizationId?: string) => Promise<string | null>;

let tokenGetter: TokenGetter | null = null;

export function setTokenGetter(getter: TokenGetter) {
  tokenGetter = getter;
}

export interface ApiOptions extends RequestInit {
  /** Mint an org-scoped token for this request (sets the `org_id` claim). */
  organizationId?: string;
}

export async function api(path: string, options?: ApiOptions): Promise<Response> {
  const headers = new Headers(options?.headers);
  if (!headers.has("Content-Type") && options?.body) {
    headers.set("Content-Type", "application/json");
  }

  if (tokenGetter) {
    const token = await tokenGetter(options?.organizationId);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const base = API_URL || "";
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401 && !path.includes("/auth/")) {
    window.dispatchEvent(new CustomEvent("auth:expired"));
  }

  return res;
}
