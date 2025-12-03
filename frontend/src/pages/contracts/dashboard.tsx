import { useEffect } from "react";
import type { FunctionComponent } from "../../common/types";
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";

// biome-ignore lint/complexity/useLiteralKeys: <explanation>
const dashboardId = import.meta.env["VITE_DASHBOARD_ID"];
// biome-ignore lint/complexity/useLiteralKeys: <explanation>
const dashboardUrl = import.meta.env["VITE_DASHBOARD_URL"];
// biome-ignore lint/complexity/useLiteralKeys: <explanation>
const appEnv = import.meta.env["VITE_APP_ENVIRONMENT"];

console.log(
  `appEnv: ${appEnv} dashboardId: ${dashboardId} dashboardUrl: ${dashboardUrl}`
);

export const ContractDashboardPage = (): FunctionComponent => {
  useEffect(() => {
    const sdk = new ChartsEmbedSDK({
      baseUrl: dashboardUrl
        ? dashboardUrl
        : "https://charts.mongodb.com/charts-nrl-qa-wuliuze"
    });

    // Embed a dashboard
    const dashboard = sdk.createDashboard({
      dashboardId: dashboardId ? dashboardId : "673dbf31-99b7-4da2-86bc-0327e28d5a2e"
    });

    // Render chart
    const renderChart = async () => {
      try {
        const chartElement = document.getElementById("chart");
        if (chartElement) {
          await dashboard.render(chartElement);
        }
      } catch (err) {
        console.error("Error during Charts rendering:", err);
      }
    };

    renderChart();
  }, []);

  return (
    <div className="container mx-auto mt-16">
      <div id="chart" style={{ height: "800px" }} />
    </div>
  );
};
