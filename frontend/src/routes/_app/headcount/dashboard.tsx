import { createFileRoute } from "@tanstack/react-router";
import { HeadCountDashboardPage } from "../../../pages/headcount/dashboard";

export const Route = createFileRoute("/_app/headcount/dashboard")({
  component: () => <HeadCountDashboardPage />
});
