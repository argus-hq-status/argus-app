import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/")({
  component: () => null,
  beforeLoad: () => {
    throw redirect({ to: "/monitors" });
  },
});


