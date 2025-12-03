import { useEffect, useState, type ReactElement } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthStore } from "../store";
import { Header } from "./Header";
import { useGetUserMeta } from "../api/backend/backendComponents";
import { UserMetaResponseDto } from "../api/backend/backendSchemas";
import { useRouter } from "@tanstack/react-router";
import { ContractFormListPage } from "../pages/contracts/List";
import Tour from "../common/Tour";
import { Loader } from "../components/Loader";
import { HeadCountListPage } from "../pages/headcount/List";
import { ToasterProvider } from "./providers/Toaster";

interface PageLayoutProps {
  children: ReactElement;
}

export function PageLayout(props: PageLayoutProps) {
  const [moduleResponse, setModuleResponse] = useState<UserMetaResponseDto | undefined>();
  const [emailId, setEmailId] = useState<string>("");
  const [idTokenId, setIdTokenId] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const { getIdTokenClaims, user } = useAuth0();
  const router = useRouter();
  const currentPath = router.state.location;

  useEffect(() => {
    const getToken = async (): Promise<string> => {
      const idTokenClaims = await getIdTokenClaims();
      const idToken = idTokenClaims?.__raw || "";

      setEmailId(user?.email || "");
      setIdTokenId(idToken);
      setUsername(user?.name || "");

      useAuthStore.setState(state => ({
        ...state,
        emailId: user?.email,
        name: user?.name,
        idToken: idToken,
        accessToken: idToken
      }));

      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      const environment = import.meta.env["VITE_APP_ENVIRONMENT"];
      if (environment === "dev" || environment === "development") {
        const selectedUser = localStorage.getItem("selectedUser");
        if (selectedUser) {
          const parts = selectedUser.split("-");
          if (parts[0]) {
            setEmailId(parts[0]);
          }
        }
      }
      return idToken;
    };
    if (user) {
      getToken();
    }
  }, [user, getIdTokenClaims]);

  const { data, error } = useGetUserMeta(
    {
      pathParams: { email: emailId ? emailId : "" },
      headers: {
        Authorization: `Bearer ${idTokenId}`
      }
    },
    {
      enabled: !!emailId && !!idTokenId,
      retry: false
    }
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (data) {
      setModuleResponse(data);
      useAuthStore.setState(() => ({
        name: data?.data.username ?? username,
        emailId: data?.data.email,
        permissions: data?.data.modules?.flatMap(module => module.permissions) ?? null,
        roles: data?.data.roles?.map(role => role.name) ?? null,
        modules: data?.data.modules?.map(role => role.name) ?? null
      }));

      // Redirect to module's forms page on root path
      if (!currentPath || currentPath?.pathname === "/") {
        const firstModuleCode = data.data?.modules?.[0]?.code;
        if (firstModuleCode === "contract") {
          router.navigate({ to: "/contract/forms" });
        } else if (firstModuleCode === "headcount") {
          router.navigate({ to: "/headcount/forms" });
        }
      }
    }
  }, [data]);

  if (error) {
    console.error("Error fetching data:", error);
  }

  return (
    <div className="w-full">
      {!data ? (
        <Loader />
      ) : (
        <>
          <Tour />
          <Header data={moduleResponse} />
          <ToasterProvider />
          <div className="mt-28 sm:mt-[4.5rem] h-[calc(100vh-7rem)] sm:h-[calc(100vh-4.5rem)]">
            {!currentPath || currentPath?.pathname === "/" ? (
              data.data?.modules?.[0]?.code === "contract" ? (
                <ContractFormListPage />
              ) : data.data?.modules?.[0]?.code === "headcount" ? (
                <HeadCountListPage />
              ) : (
                <h1 className="text-black font-medium">Module Not Found</h1>
              )
            ) : (
              props.children
            )}
          </div>
        </>
      )}
    </div>
  );
}
