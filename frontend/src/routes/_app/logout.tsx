import { createFileRoute } from "@tanstack/react-router";
import { DynamicPage } from "../../pages/DynamicPage";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

// Define the dynamic route with $page as a variable
export const Route = createFileRoute("/_app/logout")({
  component: () => <DynamicPageWithSessionCheck />
});

// Component to handle session check and redirect
const DynamicPageWithSessionCheck = () => {
  const { logout, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.removeItem("selectedUser");
      //localStorage.removeItem("tour")
      logout({
        logoutParams: {
          returnTo: window.location.origin
        }
      });
    }
  }, [isAuthenticated, logout]);

  return <DynamicPage />;
};
