import { createFileRoute } from "@tanstack/react-router";
import { HeadCountListPage } from "../../../pages/headcount/List";

export const Route = createFileRoute("/_app/headcount/forms")({
  component: () => <HeadCountListPage />
});
