import { createFileRoute } from "@tanstack/react-router";
import { HeadCountConfigurationListPage } from "../../../../pages/headcount/configuration/List";

export const Route = createFileRoute("/_app/headcount/configuration/list")({
  component: () => <HeadCountConfigurationListPage />
});
