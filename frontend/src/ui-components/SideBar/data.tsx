import {
  ArrowPathIcon,
  Cog6ToothIcon,
  HomeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { ContentProps } from "./types";

export const mainList: ContentProps[] = [
  {
    id: "home",
    label: "Home",
    action: ({ className }) => <HomeIcon className={className} />,
  },
  {
    id: "users",
    label: "Users",
    action: ({ className }) => <UserGroupIcon className={className} />,
  },
  {
    id: "nav",
    label: "Nav",
    action: ({ className }) => <ArrowPathIcon className={className} />,
  },
];

export const footerList: ContentProps[] = [
  {
    id: "setting",
    label: "Setting",
    action: ({ className }) => <Cog6ToothIcon className={className} />,
  },
];
