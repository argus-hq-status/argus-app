const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function apiUrl(path: string): string {
  if (typeof window !== "undefined" && path.startsWith("/api/")) {
    return path.replace("/api/", "/api/proxy/");
  }
  return path;
}

export function fetchApi(path: string, options?: RequestInit): Promise<Response> {
  const url = `${API_URL}${path}`;
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
}

export function fetchApiWithAuth(path: string, token: string, options?: RequestInit): Promise<Response> {
  const url = `${API_URL}${path}`;
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Cookie: `next-auth.session-token=${token}`,
      ...options?.headers,
    },
  });
}
