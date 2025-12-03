import {
  ArchiveBoxIcon,
  EyeIcon,
  UserIcon,
  ViewColumnsIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { MenuItemProps } from "./types";

export const menuOptions = [
  {
    id: "1",
    label: "Account Setting",
  },
  {
    id: "2",
    label: "Support",
    url: "link",
  },
  {
    id: "3",
    label: "License",
    url: "link",
  },
  {
    id: "4",
    label: "Sign Out",
  },
];

export const menuIconOptions: MenuItemProps[] = [
  {
    id: "1",
    label: "Condition",
    content: <UserIcon className="font-semibold text-gray-700 h-4 w-4" />,
  },
  {
    id: "2",
    label: "Canceled/Terminated",
    url: "link",
    content: <XCircleIcon className="font-semibold text-gray-700 h-4 w-4" />,
  },
  {
    id: "3",
    label: "Monitor",
    url: "link",
    content: <EyeIcon className="font-semibold text-gray-700 h-4 w-4" />,
  },
  {
    id: "4",
    label: "Suspended",
    content: <ViewColumnsIcon className="font-semibold text-gray-700 h-4 w-4" />,
  },
  {
    id: "5",
    label: "Canceled",
    content: <ArchiveBoxIcon className="font-semibold text-gray-700 h-4 w-4" />,
  },
];
