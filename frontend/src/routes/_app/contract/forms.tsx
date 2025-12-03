import { createFileRoute } from "@tanstack/react-router";
import { ContractFormListPage } from "../../../pages/contracts/List";

export const Route = createFileRoute("/_app/contract/forms")({
  component: () => <ContractFormListPage />
});
