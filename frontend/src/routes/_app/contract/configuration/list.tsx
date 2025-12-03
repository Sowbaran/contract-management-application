import { createFileRoute } from "@tanstack/react-router";
import { ContractConfigurationListPage } from "../../../../pages/contracts/configuration/List";

export const Route = createFileRoute("/_app/contract/configuration/list")({
  component: () => <ContractConfigurationListPage />
});
