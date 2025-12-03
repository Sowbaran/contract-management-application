import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { createRouter } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary.tsx";
import { routeTree } from "./routeTree.gen.ts";
import { auth0Config } from "./authConfig";
import { setAuth0Instance } from "./utils/api";
import "./styles/tailwind.css";

// Component to initialize Auth0 instance globally
const Auth0Initializer = ({ children }: { children: React.ReactNode }) => {
  const auth0 = useAuth0();
  React.useEffect(() => {
    setAuth0Instance(auth0);
  }, [auth0]);

  return <>{children}</>;
};

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    // This infers the type of our router and registers it across your entire project
    router: typeof router;
  }
}


const rootElement = document.querySelector("#root") as Element;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <Auth0Provider {...auth0Config}>
          <Auth0Initializer>
            <App router={router} />
          </Auth0Initializer>
        </Auth0Provider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
