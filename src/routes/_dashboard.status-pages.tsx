import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/status-pages")({
  component: () => <Outlet />,
});
