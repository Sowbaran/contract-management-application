import React, { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { SidebarChildItem, SidebarItem, SidebarProps } from "./types";
import nrlLogo from "../../assets/nrlLogo.svg";
import { ProfileMenu } from "../ProfileMenu";
import { Link, useLocation } from "@tanstack/react-router";

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  userPermissions,
  sidebarOpen = true,
  setSidebarOpen,
  userName,
  handleShow,
  handleLogoutPopup,
  handleKeyPress,
}) => {
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState(location.pathname);
  const [, setSelectedMenu] = useState<SidebarItem | null>(null);
  const [filteredItems, setFilteredItems] = useState<SidebarItem[]>([]);
  const [selectedMenuName, setSelectedMenuName] = useState('Home');
  const [selectedMenuNameDefault, setSelectedMenuNameDefault] = useState('home');
  
  useEffect(() => {
    setSelectedItem(location.pathname);
    const pathParts = window.location.pathname.split("/");
    if(pathParts[1]){
      setSelectedMenuNameDefault(pathParts[1]);
    }
  }, [location.pathname]);

  const hasPermission = (requiredPermissions: string[] = []): boolean =>
    requiredPermissions.length === 0 ||
    requiredPermissions.every((perm) => userPermissions.includes(perm));

  const filterItemsByPermissions = (
    items: SidebarItem[] = []
  ): SidebarItem[] => {
    return items
      .filter((item) => hasPermission(item?.permissions))
      .map((item) => ({
        ...item,
        subMenuList: item.subMenuList
          ? item.subMenuList.map((subItem) => ({
              ...subItem,
              children: subItem.children
                ? subItem.children.filter((childItem) =>
                    hasPermission(childItem.permissions)
                  )
                : [],
            }))
          : [],
      }));
  };

  const filteredItemsOld = filterItemsByPermissions(items);
   // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setFilteredItems([]);
    const menu = filteredItemsOld.find((menu) => menu.code === selectedMenuNameDefault);
    if (menu) {
      setSelectedMenu(menu);
      setSelectedMenuName(menu.name);
      setFilteredItems(filterItemsByPermissions([menu]));
    }
  }, [items, userPermissions]); // Run the effect when `items` or `userPermissions` change

  const handleMenuChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMenuName = event.target.value;
    const menu = filteredItemsOld.find((menu) => menu.name === selectedMenuName);
    if (menu) {
      setSelectedMenu(menu);
      setSelectedMenuName(selectedMenuName);
      setFilteredItems(filterItemsByPermissions([menu]));
    }
  };

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>
            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex flex-1 w-full max-w-xs mr-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 flex justify-center w-10 pt-5 left-full">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="w-6 h-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex flex-col px-6 pb-4 overflow-y-auto bg-gray-900 grow gap-y-5 ring-1 ring-white/10">
                    <div className="flex items-center h-16 shrink-0 sidebar-logo">
                      <img
                        className="h-8 w-auto"
                        src={nrlLogo}
                        alt="SST Cloud Solutions"
                      />
                      <p className="pl-5 text-gray-400">Contract Approval</p>
                    </div>
                    <select
                      className="ps-1 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:leading-6 disabled:ring-gray-500 disabled:bg-gray-200 disabled:text-gray-500"
                      onChange={handleMenuChange}
                      value={selectedMenuName}
                    >
                      <option value="" disabled>
                        Select a menu
                      </option>
                      {filteredItemsOld.map((menu) => (
                        <option key={menu.name} value={menu.name}>
                          {menu.name}
                        </option>
                      ))}
                    </select>
                    <div className="flex flex-col w-64 h-full bg-gray-800 text-white">
                      <nav className="flex-1 px-2 py-4 space-y-1">
                        {filteredItems.map((item) => (
                          <MenuItem
                            key={item.name}
                            item={item}
                            selectedItem={selectedItem}
                            setSelectedItem={setSelectedItem}
                          />
                        ))}
                      </nav>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex flex-col px-6 py-4 overflow-y-auto bg-gray-900 grow gap-y-5">
            <div className="flex items-center w-auto h-10 pt-3 shrink-0">
              <img className="w-auto h-10" src={nrlLogo} alt="Nrl" />
              <p className="pl-5 text-gray-400">SST Internal Forms</p>
            </div>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              onChange={handleMenuChange}
              value={selectedMenuName}
            >
              <option value="" disabled>
                Select a menu
              </option>
              {filteredItemsOld.map((menu) => (
                <option key={menu.name} value={menu.name}>
                  {menu.name}
                </option>
              ))}
            </select>
            <div className="flex flex-col w-50 h-full bg-gray-800 text-white">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {filteredItems.map((item) => (
                  <MenuItem
                    key={item.name}
                    item={item}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                  />
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-40 flex items-center gap-x-6 px-4 py-4 bg-gray-900 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="p-2.5 -m-2.5 text-gray-400 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="w-6 h-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
          Dashboard
        </div>
        <ProfileMenu
          userName={userName}
          handleShow={handleShow}
          handleLogoutPopup={handleLogoutPopup}
          handleKeyPress={handleKeyPress}
        />
      </div>

      <div className="sticky top-0 z-40 hidden px-4 py-4 bg-gray-900 shadow-sm sm:px-6 lg:flex lg:items-center lg:gap-x-6 lg:justify-end">
        <ProfileMenu
          userName={userName}
          handleShow={handleShow}
          handleLogoutPopup={handleLogoutPopup}
          handleKeyPress={handleKeyPress}
        />
      </div>
    </>
  );
};

const MenuItem: React.FC<{
  item: SidebarItem;
  selectedItem: string;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
}> = ({ item, selectedItem, setSelectedItem }) => {
  const { icon, name, href, subMenuList } = item;
  const nodeRef = useRef(null);

  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleClick = (href: string | undefined) => {
    if (href) {
      setSelectedItem(href);
    }
  };

  const isActive = (href: string | undefined) => {
    if (!href) return false;
    if (href === selectedItem) return true;
    if (subMenuList) {
      for (const subItem of subMenuList) {
        if (subItem.href === selectedItem) return true;
        if (subItem.children) {
          for (const child of subItem.children) {
            if (child.href === selectedItem) return true;
          }
        }
      }
    }
    return false;
  };

  return (
    <div>
      {href ? (
        <Link
          to={href}
          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
            isActive(href) ? 'bg-gray-700 text-white' : 'text-gray-300'
          } hover:bg-gray-700 hover:text-white`}
          onClick={() => handleClick(href)}
        >
          {icon}
          <span className="ml-3">{name}</span>
        </Link>
      ) : (
        <button
          onClick={handleToggle}
          type="button"
          className={`group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md ${
            isActive(undefined) ? 'bg-gray-700 text-white' : 'text-gray-300'
          } hover:bg-gray-700 hover:text-white focus:outline-none`}
        >
          {icon}
          <span className="ml-3">{name}</span>
        </button>
      )}
      {subMenuList && subMenuList.length > 0 && (
        <Transition
          as={Fragment}
          show={isOpen}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div
            className="pl-4 space-y-1 hover:border hover:rounded"
            ref={nodeRef}
          >
            {subMenuList.map((subItem) => (
              <SubMenuItem
                key={subItem.name}
                item={subItem}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
              />
            ))}
          </div>
        </Transition>
      )}
    </div>
  );
};

const SubMenuItem: React.FC<{
  item: SidebarChildItem;
  selectedItem: string;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
}> = ({ item, selectedItem, setSelectedItem }) => {
  const { icon, name, href, children } = item;
  const nodeRef = useRef(null);
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleClick = (href: string | undefined) => {
    if (href) {
      setSelectedItem(href);
    }
  };

  const isActive = (href: string | undefined) => {
    if (!href) return false;
    if (href === selectedItem) return true;
    if (children) {
      for (const child of children) {
        if (child.href === selectedItem) return true;
      }
    }
    return false;
  };

  return (
    <div>
      {href ? (
        <Link
          to={href}
          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
            isActive(href) ? 'bg-gray-700 text-white' : 'text-gray-300'
          } hover:bg-gray-700 hover:text-white`}
          onClick={() => handleClick(href)}
        >
          {icon}
          <span className="ml-2">{name}</span>
        </Link>
      ) : (
        <button
          onClick={handleToggle}
          type="button"
          className={`group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md ${
            isActive(undefined) ? 'bg-gray-700 text-white' : 'text-gray-300'
          } hover:bg-gray-700 hover:text-white focus:outline-none`}
        >
          {icon}
          <span className="ml-2">{name}</span>
        </button>
      )}
      {children && children.length > 0 && (
        <Transition
          as={Fragment}
          show={isOpen}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div className="pl-4 space-y-1" ref={nodeRef}>
            {children.map((child) => (
              <SubMenuItem
                key={child.name}
                item={child}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
              />
            ))}
          </div>
        </Transition>
      )}
    </div>
  );
};
