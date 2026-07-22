import { createFileRoute } from "@tanstack/react-router";
import { TwentyDashboard } from "../components/dashboard/twenty-dashboard";

export const Route = createFileRoute("/_dashboard/")({
  component: TwentyDashboard,
});

