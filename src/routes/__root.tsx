import { HeadContent, Scripts, createRootRoute, Link } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/tanstack-react-start";
import { ApiAuthBridge } from "~/lib/api-auth-bridge";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/toaster";
import type { ReactNode } from "react";
import appCss from "~/styles/app.css?url";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Strauz" },
    ],
    links: [
      {
        rel: "preload",
        href: "/fonts/Fonts/WEB/fonts/Switzer-Variable.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">Page not found</p>
      <Link to="/" className="text-primary underline-offset-4 hover:underline">
        Go home
      </Link>
    </div>
  ),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ClerkProvider
          proxyUrl="/__clerk"
          signInUrl="/login"
          signUpUrl="/signup"
          afterSignOutUrl="/login"
        >
          <ThemeProvider defaultTheme="system" storageKey="argus-theme">
            <QueryClientProvider client={queryClient}>
              <ApiAuthBridge>
                {children}
                <Toaster />
              </ApiAuthBridge>
            </QueryClientProvider>
          </ThemeProvider>
        </ClerkProvider>
        <Scripts />
      </body>
    </html>
  );
}
