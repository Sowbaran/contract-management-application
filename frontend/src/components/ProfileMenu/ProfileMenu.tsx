import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { ChevronDownIcon, QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import { Link } from "@tanstack/react-router";
import type { ProfileMenuProps } from "./types";
import { useShepherdTour } from "react-shepherd";
import 'shepherd.js/dist/css/shepherd.css';
import { useAuthStore } from "../../store";
import { steps } from "./steps";

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
      enabled: true,
    },
  },
  useModalOverlay: true,
};

export function ProfileMenu({
  userName = "",
  handleShow,
  handleKeyPress,
  handleLogoutPopup,
}: ProfileMenuProps) {
   // biome-ignore lint/complexity/useLiteralKeys: <explanation>
  const environment = import.meta.env["VITE_APP_ENVIRONMENT"];

  let nameInitials =
    userName
      ?.split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("") || "";

  if (environment === "dev" || environment === "development") {
    const selectedUser = localStorage.getItem("selectedUser");
    if (selectedUser) {
      const parts = selectedUser.split("-");
      userName = parts[1] ? parts[1] : "";
      nameInitials = userName
        ?.split(" ")
        .map((word) => word.charAt(0).toUpperCase())
        .join("") || "";
    }
  }
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const permissions = useAuthStore((state: { permissions: any }) => state.permissions);
  const [filteredSteps, setFilteredSteps] = useState<Step[]>([]);
  useEffect(() => {
    const filteredSteps = steps.filter(step => {
      if (step.id === 'done') {
        return true;
      } // biome-ignore lint/style/noUselessElse: <explanation>
      else if (step.id.startsWith('finance')) {
        return permissions.some((permission: string) => permission.startsWith('finance'));
      } // biome-ignore lint/style/noUselessElse: <explanation>
      else if (step.id.startsWith('people-and-culture')) {
        return permissions.some((permission: string) => permission.startsWith('peopleAndCulture'));
      } // biome-ignore lint/style/noUselessElse: <explanation>
      else if (step.id.startsWith('settings')) {
        return permissions.some((permission: string) => permission.startsWith('settings'));
      }
      return false;
    });

    setFilteredSteps(filteredSteps);
  }, [permissions]);

   // @ts-ignore
   const tour = useShepherdTour({ tourOptions, steps: filteredSteps });

  return (
    <div className="relative flex items-center space-x-4">
      <button
        type="button"
        className="bg-gray-300 rounded-full shadow-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
        onClick={tour.start}
        title="Help"
      >
        <QuestionMarkCircleIcon className="w-8 h-8" />
      </button>
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center space-x-2">
          <span className="sr-only">Open user menu</span>
          <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full shadow-md">
            <span className="text-sm font-medium text-black leading-none">
              {nameInitials}
            </span>
          </span>
          <span className="hidden lg:flex lg:items-center">
            <span
              className="ml-4 text-sm font-semibold leading-6 text-white"
              aria-hidden="true"
            >
              {userName}
            </span>
            <ChevronDownIcon
              className="w-5 h-5 ml-2 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
            <Menu.Item>
              <div
                className="block px-3 py-1 text-sm leading-6 text-gray-900 bg-gray-50"
                onClick={handleShow}
                onKeyPress={handleKeyPress}
                tabIndex={0} // Ensures the div is focusable
                role="button" // Indicates the div is a button
              >
                Profile
              </div>
            </Menu.Item>
            {environment === "dev" && (
              <Menu.Item>
                <Link
                  className="block px-3 py-1 text-sm leading-6 text-gray-900"
                  to="/switch-user"
                >
                  <li className="list-none">Impersonate</li>
                </Link>
              </Menu.Item>
            )}
            <Menu.Item key={"logout"}>
              <button
                type="button"
                onClick={handleLogoutPopup}
                className="block px-3 py-1 text-sm leading-6 text-gray-900"
              >
                Logout
              </button>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
