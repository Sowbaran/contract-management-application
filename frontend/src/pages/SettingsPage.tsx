import { useEffect, useState } from "react";
import { Tabs } from "@ui-components";
import { SettingsTabConst } from "../constants/formConstants";
import { TabProp } from "@ui-components/Tabs/types";
import { useSelectedModuleStore, useSelectedModuleTabStore } from "../store";
import { ModuleList } from "./settings/ModuleList";
import { PermissionList } from "./settings/PermissionList";
import { DepartmentList } from "./settings/DepartmentList";
import { RoleList } from "./settings/RoleList";
import { UserList } from "./settings/UserList";

export const SettingsPage = () => {
  const { moduleStore } = useSelectedModuleStore();
  useSelectedModuleTabStore;

  const [selectedTabs, setSelectedTabs] = useState<TabProp[]>([]);
  const [selectedTab, setSelectedTab] = useState<TabProp>({ name: "", id: "" });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (moduleStore?._id && moduleStore.permissions) {
      const filtered = SettingsTabConst.filter((item: TabProp) =>
        moduleStore.permissions.some(it => it === item.id)
      );
      setSelectedTabs(filtered);
      setSelectedTab(filtered[0] || { name: "", id: "" });
    }
  }, [moduleStore?._id]);

  const onTabChange = (item: TabProp) => {
    setSelectedTab({ ...item });
  };

  const renderContent = () => {
    switch (selectedTab.id) {
      case "view-user-settings":
        return <UserList />;
      case "view-department-settings":
        return <DepartmentList />;
      case "view-role-settings":
        return <RoleList />;
      case "view-permission-settings":
        return <PermissionList />;
      case "view-module-settings":
        return <ModuleList />;
      default:
        return <div>Select a tab to view details.</div>;
    }
  };

  return (
    <div className="w-full">
      <div className=" w-full">
        <div className="px-8 ">
          <div className="">
            <span className="text-gray-900 font-semibold">{`${moduleStore?.name}`}</span>
          </div>
        </div>
        <div className="mt-3 border-b-2 border-b-gray-200" />
      </div>
      <div className="mt-3 px-8 ">
        <div className="overflow-x-auto">
          <Tabs
            selectedTab={selectedTab?.id}
            tabList={selectedTabs}
            onTabChange={onTabChange}
            tabStyle="data-[selected]:border-b-2 data-[selected]:border-b-green-500 data-[selected]:text-green-600 hover:border-b-2 hover:border-b-gray-300 hover:text-gray-700 text-md font-medium"
          />
        </div>
      </div>
      <div className="mt-0 border-b border-b-gray-200" />
      <div className="mt-4">{renderContent()}</div>
    </div>
  );
};
