import {
  FormsHeadCountTabConst,
  FormsTabConst,
  HeadCountHeaderTabConst,
  HeaderAvatarMenu,
  HeaderTabConst,
  SubHeadCountHeaderTabConst,
  SubHeaderTabConst
} from "../constants/formConstants";
import { useAuth0 } from "@auth0/auth0-react";
import { BellIcon, QuestionMarkCircleIcon, UserIcon } from "@heroicons/react/24/outline";
import { Avatar, Button, Drawer, Menu, Tabs } from "@ui-components";
import { useEffect, useState } from "react";
import { AnyProp, TabPropExtended, UserModule } from "../common/types";
import { MenuItemProps } from "@ui-components/Menu/types";
import { TabProp } from "@ui-components/Tabs/types";
import {
  useAuthStore,
  useFormTabStore,
  useSelectedModuleStore,
  useSelectedModuleTabStore
} from "../store";
import { useGetImpersonateUsersList } from "../api/backend/backendComponents";
import { UserMetaResponseDto } from "../api/backend/backendSchemas";
import { useRouter } from "@tanstack/react-router";
import { useShepherdTour } from "react-shepherd";
import "shepherd.js/dist/css/shepherd.css";
import { Steps } from "./Steps";

type HeaderProp = {
  data: UserMetaResponseDto | undefined;
};

interface Step {
  id: string;
  beforeShowPromise: () => Promise<void>;
  buttons: { classes: string; text: string; type: string }[];
  highlightClass: string;
  scrollTo: boolean;
  cancelIcon: { enabled: boolean };
  title: string;
  text: string[];
  when: { show: () => void; hide: () => void };
}

const tourOptions = {
  defaultStepOptions: {
    classes: "shadow-md bg-purple-dark",
    scrollTo: true,
    cancelIcon: {
      enabled: true
    }
  },
  useModalOverlay: true
};

export function Header({ data }: HeaderProp) {
  const router = useRouter();
  const { logout } = useAuth0();
  const name = useAuthStore(state => state.name);
  const emailId = useAuthStore(state => state.emailId);
  const accessToken = useAuthStore(state => state.accessToken);
  const roles = useAuthStore(state => state.roles);
  // biome-ignore lint/complexity/useLiteralKeys: <explanation>
  const environment = import.meta.env["VITE_APP_ENVIRONMENT"];
  const [moduleOptions, setModuleOptions] = useState<MenuItemProps[]>([]);
  const [headerTabPermissions, setHeaderTabPermissions] = useState<TabProp[]>([]);
  const { logout: auth0Logout } = useAuth0();
  const { moduleStore, setModuleStore } = useSelectedModuleStore();
  const { setModuleTabStore } = useSelectedModuleTabStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [impersonateDrawerOpen, setImpersonateDrawerOpen] = useState(false);
  const { setFormTab } = useFormTabStore();
  const [selectedTab, setSelectedTab] = useState<TabPropExtended>();
  const [selectedModule, setSelectedModule] = useState<UserModule>();
  const [userOptions, setUserOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [filteredSteps, setFilteredSteps] = useState<Step[]>(Steps);

  useEffect(() => {
    const filteredSteps = Steps.filter(step => {
      if (step.id === "done") {
        return true;
      }
      // biome-ignore lint/style/noUselessElse: <explanation>
      else if (step.id.startsWith("finance")) {
        return moduleOptions.some(module => module.id.startsWith("contract"));
      }
      // biome-ignore lint/style/noUselessElse: <explanation>
      else if (step.id.startsWith("settings")) {
        return moduleOptions.some(module => module.id.startsWith("settings"));
      }
      return false;
    });

    setFilteredSteps(filteredSteps);
  }, [moduleOptions]);

  if (environment === "dev") {
    HeaderAvatarMenu.splice(1, 0, {
      id: "impersonate",
      label: "Impersonate"
    });
  }
  const uniqueHeaderAvatarMenu = HeaderAvatarMenu.filter(
    (item, index, self) => index === self.findIndex(t => t.id === item.id)
  );

  const onModuleChange = (moduleId: string, moduleData: MenuItemProps | undefined) => {
    setModuleStore(moduleData?.data);
    if (moduleId === "settings") {
      router.navigate({ to: "/settings" });
    } else if (moduleId === "contract") {
      router.navigate({ to: "/contract/forms" });
    } else if (moduleId === "headcount") {
      router.navigate({ to: "/headcount/forms" });
    }
    setSelectedModule(moduleData?.data);
  };

  const currentPath = router.state.location.pathname;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (moduleOptions?.length > 0) {
      const paths = currentPath.split("/");
      const pathModuleId = currentPath === "/" ? data?.data.modules[0]?.code : paths[1];
      let moduleItem = null;
      if (currentPath === "/settings") {
        moduleItem = moduleOptions.find(item => item.id === "settings");
      } else if (pathModuleId === "headcount") {
        moduleItem = moduleOptions.find(item => item.id === "headcount");
      } else if (pathModuleId === "finance") {
        moduleItem = moduleOptions.find(item => item.id === moduleStore?.code);
      } else {
        moduleItem = moduleOptions.find(item => item.id === pathModuleId);
      }
      if (moduleItem) {
        setSelectedModule(moduleItem?.data);
        setModuleStore(moduleItem?.data);
      }
    }
  }, [currentPath, moduleOptions]);

  const onTabChange = (option: TabPropExtended) => {
    setModuleTabStore({ ...option });
    // console.log("tab change --- ", option);
    setSelectedTab(option);
    router.navigate({
      to: `${option?.href}`
    });
  };

  const strInitialLetter = (value: string) => {
    return value
      .split(" ")
      .map(it => it.charAt(0))
      .join("")
      .slice(0, 2);
  };

  const onAvatarMenuChange = (menuId: string) => {
    switch (menuId) {
      case "log-out":
        localStorage.removeItem("selectedUser");
        //localStorage.removeItem("tour");
        logout({
          logoutParams: {
            returnTo: window.location.origin
          }
        });
        break;
      case "my-profile":
        setDrawerOpen(true);
        break;
      default:
        setImpersonateDrawerOpen(true);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const moduleList = data?.data.modules;
    const moduleOptionList =
      moduleList?.map(item => ({
        id: item.code,
        label: item.name,
        data: item as UserModule
      })) || [];
    const module = moduleOptionList.find(item => item.id === "contract") || {
      id: "",
      label: "",
      data: {} as UserModule
    };
    // setSelectedModule(module);
    setModuleStore(module?.data);
    setModuleOptions(moduleOptionList);
  }, [data]);

  useEffect(() => {
    setUserOptions([{ value: "", label: "" }]);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (selectedModule) {
      let filtered: TabProp[] = [];
      if (selectedModule?.code === "contract") {
        setFormTab(FormsTabConst[0] || { id: "", name: "" });

        filtered = HeaderTabConst.filter(item =>
          selectedModule.permissions?.some((it: string) => it === item.id)
        );
        setSelectedTab(filtered.find(item => item.id === "view-forms-menu"));
      } else if (selectedModule?.code === "headcount") {
        setFormTab(FormsHeadCountTabConst[0] || { id: "", name: "" });

        filtered = HeadCountHeaderTabConst.filter((item: AnyProp) =>
          selectedModule.permissions?.some((it: string) => it === item.id)
        );
        setSelectedTab(filtered.find(item => item.id === "view-headcount-forms-menu"));
      }
      setHeaderTabPermissions(filtered);

      let tabItem = null;
      if (selectedModule?.code === "contract") {
        tabItem = HeaderTabConst.find(item => currentPath === item.href);

        if (!tabItem) {
          tabItem = SubHeaderTabConst.find(item => currentPath.includes(item.href));
        }

        if (!tabItem?.id || tabItem.id === "") {
          tabItem = HeaderTabConst.find(item => item.id === "view-forms-menu");
        }
      } else if (selectedModule?.code === "headcount") {
        tabItem = HeadCountHeaderTabConst.find(item => item.href === currentPath);

        if (!tabItem) {
          tabItem = SubHeadCountHeaderTabConst.find(item =>
            currentPath.includes(item.href)
          );
        }
        if (!tabItem?.id || tabItem.id === "") {
          tabItem = HeadCountHeaderTabConst.find(
            item => item.id === "view-headcount-forms-menu"
          );
        }
      }

      if (tabItem) {
        setModuleTabStore(tabItem);
        setSelectedTab(tabItem);
      }
    }
  }, [selectedModule]);

  const { data: userListQuery } = useGetImpersonateUsersList(
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    },
    {
      enabled: !!impersonateDrawerOpen && !!accessToken,
      retry: false
    }
  );

  useEffect(() => {
    if (userListQuery) {
      if (userListQuery.data && Array.isArray(userListQuery.data)) {
        const options = userListQuery.data.map(({ name, email, departments }) => ({
          value: `${email}-${departments.join(", ")}`,
          label: name
        }));
        setUserOptions(options);
      }
    }
  }, [userListQuery]);

  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedUser(selectedValue);
  };

  const handleSwitchUser = () => {
    if (selectedUser) {
      localStorage.setItem("selectedUser", selectedUser);
      window.location.href = "/";
    }
  };

  const tour = useShepherdTour({ tourOptions, steps: filteredSteps });

  return (
    <>
      <div className="px-2 sm:px-4 z-20 fixed inset-x-0 top-0 bg-black w-full mb-4 sm:mb-0">
        {/* Small Screens Layout */}
        <div className="flex sm:hidden flex-col w-full">
          {/* Title + Icons (Same Row) */}
          <div className="flex justify-between items-center w-full">
            {/* Title */}
            <p className="font-bold text-sm text-white">SST Internal Forms</p>

            {/* Right-Side Icons */}
            <div className="flex items-center mt-1 sm:space-x-2">
              {/* Dropdown */}
              <Menu
                selectedId={selectedModule?.code}
                buttonClassName="bg-green-600 text-sm w-48"
                label={selectedModule?.name || "Select Module"}
                buttonVariants={{ variant: "dark" }}
                containerVariants={{ align: "left" }}
                options={moduleOptions}
                onMenuChange={onModuleChange}
              />

              {/* Question Icon */}
              <Button
                buttonType="icon"
                variant="plain"
                iconSize="sm"
                title="Help"
                className="bg-black hover:bg-neutral-700"
                leftIcon={<QuestionMarkCircleIcon className="text-white w-6 h-6" />}
                onClick={tour.start}
              />

              {/* Bell Icon */}
              <Button
                buttonType="icon"
                variant="plain"
                iconSize="sm"
                className="bg-black hover:bg-neutral-700"
                leftIcon={<BellIcon className="text-white w-6 h-6" />}
              />

              {/* Avatar */}
              <div className="flex w-9 h-9 items-center justify-center hover:bg-neutral-700 rounded-md">
                <Menu
                  buttonType="custom"
                  options={uniqueHeaderAvatarMenu}
                  buttonVariants={{ variant: "dark" }}
                  customMenuButton={
                    <Avatar
                      className="w-7 h-7 p-[1px] bg-white font-bold text-black"
                      initials={strInitialLetter(name || "")}
                      alt="Avatar"
                    />
                  }
                  onMenuChange={onAvatarMenuChange}
                />
              </div>
            </div>
          </div>

          {/* Tabs Centered Below */}
          <div className="flex justify-center w-full my-3">
            <Tabs
              selectedTab={selectedTab?.id}
              variants="dark"
              tabList={headerTabPermissions}
              onTabChange={onTabChange}
            />
          </div>
        </div>

        {/* Larger Screens Layout */}
        <div className="hidden sm:flex w-full items-center justify-between h-[58px]">
          {/* Left Side: Title + Tabs */}
          <div className="flex items-center">
            {/* Title */}
            <p className="font-bold text-md text-white">SST Internal Forms</p>

            {/* Tabs Immediately After Title */}
            <div className="ml-6">
              <Tabs
                selectedTab={selectedTab?.id}
                variants="dark"
                tabList={headerTabPermissions}
                onTabChange={onTabChange}
                tabStyle="font-semibold text-sm"
              />
            </div>
          </div>

          {/* Right Side: Icons */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Dropdown */}
            <Menu
              selectedId={selectedModule?.code}
              buttonClassName="bg-green-600 text-sm mnu-module w-48"
              label={selectedModule?.name || "Select Module"}
              buttonVariants={{ variant: "dark" }}
              containerVariants={{ align: "left" }}
              options={moduleOptions}
              onMenuChange={onModuleChange}
            />

            {/* Question Icon */}
            <Button
              buttonType="icon"
              variant="plain"
              iconSize="sm"
              title="Help"
              className="bg-black hover:bg-neutral-700"
              leftIcon={<QuestionMarkCircleIcon className="text-white w-6 h-6" />}
              onClick={tour.start}
            />

            {/* Bell Icon */}
            <Button
              buttonType="icon"
              variant="plain"
              iconSize="sm"
              className="bg-black hover:bg-neutral-700"
              leftIcon={<BellIcon className="text-white w-6 h-6" />}
            />

            {/* Avatar */}
            <div className="flex w-9 h-9 items-center justify-center hover:bg-neutral-700 rounded-md">
              <Menu
                buttonType="custom"
                options={uniqueHeaderAvatarMenu}
                buttonVariants={{ variant: "dark" }}
                customMenuButton={
                  <Avatar
                    className="w-7 h-7 p-[1px] bg-white font-bold text-black"
                    initials={strInitialLetter(name || "")}
                    alt="Avatar"
                  />
                }
                onMenuChange={onAvatarMenuChange}
              />
            </div>
          </div>
        </div>
      </div>
      {
        <Drawer
          open={drawerOpen}
          handleOpen={open => setDrawerOpen(open)}
          backgroudPanelStyle="w-full max-w-sm sm:w-[400px] mt-14"
          headerContentStyle="flex justify-between items-center py-6"
          headerContent={
            <>
              <label className="text-md  font-semibold text-black">Profile</label>
            </>
          }
          enableZindex={true}
          mainContent={
            <div className="relative h-full w-full px-6 flex flex-col py-3 gap-1">
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-start">
                  <div className="w-12 h-12 flex items-center justify-center text-green-500 bg-green-100 rounded-full">
                    <UserIcon className="w-6 h-6" />
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center">
                      <h3 className="text-l font-bold text-gray-900">{name}</h3>
                      <span className="ml-2.5 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-green-400">
                        <span className="sr-only">Online</span>
                      </span>
                    </div>
                    <p className="text-md text-gray-500">{emailId}</p>
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <p className="text-md text-gray-900 font-semibold">Roles</p>
                  <ul className="list-disc pl-5 text-sm text-gray-800">
                    {roles?.map(role => (
                      <li key={role}>{role}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          }
        />
      }

      {
        <Drawer
          open={impersonateDrawerOpen}
          handleOpen={open => setImpersonateDrawerOpen(open)}
          backgroudPanelStyle="pl-3 sm:pl-0 mt-14"
          headerContentStyle="flex justify-between items-center py-6"
          headerContent={
            <>
              <label className="text-md  font-semibold text-black">Impersonate</label>
            </>
          }
          enableZindex={true}
          mainContent={
            <div className="relative h-full w-full px-6 flex flex-col py-3 gap-4">
              <div className="pb-1 sm:pb-6">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="department"
                    className="text-sm font-semibold text-gray-900 "
                  >
                    Select User
                  </label>
                  <select
                    id="userDropdown"
                    className="ps-1 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:leading-6 disabled:ring-gray-500 disabled:bg-gray-200 disabled:text-gray-500"
                    value={selectedUser}
                    onChange={handleDropdownChange}
                  >
                    <option value="" disabled>
                      Select a user
                    </option>
                    {userOptions.map(user => (
                      <option key={user.value} value={`${user.value}-${user.label}`}>
                        {`${user.value}`}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleSwitchUser}
                  className="p-1 m-3 mx-5 rounded-md  absolute left-0 right-0 bottom-0 text-white bg-green-600 hover:bg-gray-500 border border-green-600 hover:border-gray-500"
                >
                  Impersonate
                </button>
              </div>
            </div>
          }
        />
      }
    </>
  );
}
