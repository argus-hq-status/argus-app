import { clerkMiddleware } from "@clerk/tanstack-react-start/server";
import { clerkFrontendApiProxy, matchProxyPath } from "@clerk/backend/proxy";
import { createMiddleware, createStart } from "@tanstack/react-start";

const PROXY_PREFIX = "/__clerk";

const clerkApiProxy = createMiddleware({
  type: "request",
}).server(async ({ request, next }) => {
  if (!matchProxyPath(request, { proxyPath: PROXY_PREFIX })) {
    return next();
  }

  return clerkFrontendApiProxy(request, {
    proxyPath: PROXY_PREFIX,
    publishableKey:
      process.env.VITE_CLERK_PUBLISHABLE_KEY ?? process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
    fapiUrl: process.env.CLERK_FAPI_URL,
  });
});

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [
      clerkApiProxy,
      clerkMiddleware({ proxyUrl: PROXY_PREFIX }),
    ],
  };
});
