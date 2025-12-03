import { createFileRoute } from "@tanstack/react-router";
import { ContractDashboardPage } from "../../../pages/contracts/dashboard";

export const Route = createFileRoute("/_app/contract/dashboard")({
  component: () => <ContractDashboardPage />
});
