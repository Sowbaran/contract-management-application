import { createFileRoute } from "@tanstack/react-router";
import { HeadCountConfigurationUpdateForm } from "../../../../pages/headcount/configuration/Update";

type FormFilter = {
  moduleId: string;
};

export const Route = createFileRoute(
  "/_app/headcount/configuration/update/$configurationId"
)({
  component: () => <HeadCountConfigurationUpdateForm />,
  validateSearch: (search: FormFilter) => {
    return {
      moduleId: search.moduleId
    };
  }
});
