import { createFileRoute } from "@tanstack/react-router";
import { HeadCountDetailPage } from "../../../../pages/headcount/Detail";

type FormFilter = {
  page: string;
  moduleId: string;
};

export const Route = createFileRoute("/_app/headcount/requests/detail/$formId")({
  component: HeadCountDetailPage,
  validateSearch: (search: FormFilter) => {
    return {
      page: search.page,
      moduleId: search.moduleId
    };
  }
});
