import { useEffect } from "react";
import type { FunctionComponent } from "../../common/types";
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";

// biome-ignore lint/complexity/useLiteralKeys: <explanation>
const dashboardId = import.meta.env["VITE_DASHBOARD_ID"];

export const HeadCountDashboardPage = (): FunctionComponent => {
  useEffect(() => {
    const sdk = new ChartsEmbedSDK({
      baseUrl: "https://charts.mongodb.com/charts-nrl-dev-pmiax"
    });

    // Embed a dashboard
    const dashboard = sdk.createDashboard({
      dashboardId: dashboardId ? dashboardId : "a2c60d84-0edc-42db-b0ac-bec64cfe6c9f"
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
