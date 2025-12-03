import { createFileRoute } from "@tanstack/react-router";
import { ContractConfigurationUpdateFormNew } from "../../../../pages/contracts/configuration/UpdateNew";

type FormFilter = {
  moduleId: string;
};

export const Route = createFileRoute(
  "/_app/contract/configuration/update/$configurationId"
)({
  component: () => <ContractConfigurationUpdateFormNew />,
  validateSearch: (search: FormFilter) => {
    return {
      moduleId: search.moduleId
    };
  }
});
