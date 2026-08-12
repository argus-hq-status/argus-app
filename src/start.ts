import { clerkMiddleware } from "@clerk/tanstack-react-start/server";
import { createMiddleware, createStart } from "@tanstack/react-start";

const PROXY_PREFIX = "/__clerk";

function base64urlDecode(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const b64 = padded + (padded.length % 4 === 2 ? "==" : padded.length % 4 === 3 ? "=" : "");
  return atob(b64);
}

// Derive the Clerk Frontend API origin from the publishable key (the key
// embeds the `<instance>.clerk.accounts.dev` domain). Override with
// CLERK_FAPI_URL when using a custom domain/satellite.
function clerkFapiBase(): string {
  const explicit = process.env.CLERK_FAPI_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const key = process.env.VITE_CLERK_PUBLISHABLE_KEY;
  const match = key?.match(/^pk_(test|live)_(.+)$/);
  if (match) {
    try {
      const domain = base64urlDecode(match[2]);
      if (domain.endsWith(".clerk.accounts.dev")) return `https://${domain}`;
    } catch {
      // Fall through to the default below.
    }
  }

  return "https://unbiased-mule-86.clerk.accounts.dev";
}

function stripFapiCookieDomain(headers: Headers, fapiHost: string): void {
  const cookies = headers.getSetCookie?.() ?? (headers.get("set-cookie") ? [headers.get("set-cookie")!] : []);
  if (cookies.length === 0) return;
  headers.delete("set-cookie");
  for (const cookie of cookies) {
    headers.append("set-cookie", cookie.replace(new RegExp(`;\s*domain=${fapiHost}`, "gi"), ""));
  }
}

// Proxy for Clerk's Frontend API. When a proxy URL is configured in the Clerk
// dashboard, ClerkJS is served from `<app>/__clerk/*` and every request here
// must be forwarded to the Frontend API with the proxy headers intact.
const clerkApiProxy = createMiddleware({
  type: "request",
}).server(async ({ request, pathname, next }) => {
  if (!pathname.startsWith(PROXY_PREFIX)) {
    return next();
  }

  const url = new URL(request.url);
  const fapiBase = clerkFapiBase();
  const fapiUrl = new URL(fapiBase);
  const targetPath = pathname.slice(PROXY_PREFIX.length) + url.search;
  const target = new URL(targetPath, fapiUrl);

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.set("Clerk-Proxy-Url", `${url.origin}${PROXY_PREFIX}`);
  if (process.env.CLERK_SECRET_KEY) {
    headers.set("Clerk-Secret-Key", process.env.CLERK_SECRET_KEY);
  }
  if (!headers.get("x-forwarded-for")) {
    headers.set("x-forwarded-for", url.host);
  }

  const init: RequestInit = { method: request.method, headers, redirect: "manual" };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  let upstream: Response;
  try {
    upstream = await fetch(target.toString(), init);
  } catch (err) {
    return new Response(`Clerk proxy error: ${err instanceof Error ? err.message : String(err)}`, {
      status: 502,
      headers: { "Content-Type": "text/plain" },
    });
  }

  const resHeaders = new Headers(upstream.headers);
  const location = resHeaders.get("location");
  if (location) {
    try {
      const loc = new URL(location, fapiUrl);
      if (loc.origin === fapiUrl.origin) {
        resHeaders.set("location", `${url.origin}${PROXY_PREFIX}${loc.pathname}${loc.search}`);
      }
    } catch {
      // Leave the location header untouched.
    }
  }
  stripFapiCookieDomain(resHeaders, fapiUrl.host);

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: resHeaders,
  });
});

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [clerkApiProxy, clerkMiddleware()],
  };
});