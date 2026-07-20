import { HeadContent, Scripts, createRootRoute, Link } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "~/lib/auth-context";
import { Toaster } from "~/components/ui/toaster";
import type { ReactNode } from "react";
import appCss from "~/styles/app.css?url";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Argus" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Geist:ital,wght@0,100..900;1,100..900&display=swap" },
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
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
