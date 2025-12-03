import { AnyProp, type FunctionComponent } from "../common/types";
import { ReactElement, useEffect, useState } from "react";
import { useSelectedModuleStore, useSelectedModuleTabStore } from "../store";
import { useRouter } from "@tanstack/react-router";
import { HeaderTabConst } from "../constants/formConstants";
import { ContractFormListPage } from "./contracts/List";
import { UserMetaResponseDto } from "../api/backend/backendSchemas";

export type ModuleApiProps = {
  data: UserMetaResponseDto | undefined;
  children?: ReactElement;
};

export const Home = ({ children }: ModuleApiProps): FunctionComponent => {
  const { moduleTabStore } = useSelectedModuleTabStore();
  const { moduleStore } = useSelectedModuleStore();

  const [externalNav, setExternalNav] = useState(true);
  const router = useRouter();
  const currentPath: AnyProp = router.state.location.pathname;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (currentPath.includes("finance/vendor-contract/requests") && externalNav) {
      console.log("nav --- ", externalNav);
      setExternalNav(false);
      router.navigate({ to: window.location.pathname });
    } else {
      if (moduleStore?.code && moduleTabStore?.id) {
        // console.log("module store --- ", moduleStore);
        const item = HeaderTabConst.find(navItem => navItem.id === moduleTabStore.id);

        if (item?.href) {
          if (currentPath !== "/" || moduleTabStore?.id !== "viewFormsMenu") {
            router.navigate({ to: `/${moduleStore.code}/${item.href}` });
          }
        }
      }
    }
  }, [moduleTabStore, moduleStore]);

  return (
    <>
      <div className="w-full">
        {currentPath === "/" ? <ContractFormListPage /> : children}
      </div>
    </>
  );
};
