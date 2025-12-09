import { useEffect, useRef } from "react";
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
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let dashboard: any = null;

    const renderChart = async () => {
      try {
        if (!chartContainerRef.current) {
          console.error("Chart container element not found");
          return;
        }

        const sdk = new ChartsEmbedSDK({
          baseUrl: dashboardUrl
            ? dashboardUrl
            : "https://charts.mongodb.com/charts-nrl-qa-wuliuze"
        });

        // Embed a dashboard
        dashboard = sdk.createDashboard({
          dashboardId: dashboardId ? dashboardId : "673dbf31-99b7-4da2-86bc-0327e28d5a2e"
        });

        // Render chart
        await dashboard.render(chartContainerRef.current);
      } catch (err) {
        console.error("Error during Charts rendering:", err);
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      renderChart();
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      if (dashboard && chartContainerRef.current) {
        try {
          // Clear the container
          chartContainerRef.current.innerHTML = "";
        } catch (err) {
          console.error("Error during dashboard cleanup:", err);
        }
      }
    };
  }, [dashboardId, dashboardUrl]);

  return (
    <div className="container mx-auto mt-16">
      <div ref={chartContainerRef} id="chart" style={{ height: "800px" }} />
    </div>
  );
};
