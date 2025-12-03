import type { Meta, StoryObj } from "@storybook/react";

import { Menu } from "./Menu";
import { menuIconOptions } from "./data";
import { MenuUiProps } from "./types";
import { Avatar } from "../Avatar";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";

const meta: Meta<MenuUiProps> = {
  title: "Design System/Components/Menu",
  component: Menu,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "",
    },
    docs: {
      description: {
        component: `This is a Menu component`,
      },
    },
  },
} satisfies Meta<typeof Menu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: menuIconOptions,
    selectedId : "1",
    label: "Integrity",
    onMenuChange: (menuId: string) => {
      console.log(`Selected menu option: ${menuId}`);
    },
  },
};

export const CustomLabel: Story = {
  args: {
    options: menuIconOptions,
    label: "Integrity",
    onMenuChange: (menuId: string) => {
      console.log(`Selected menu option: ${menuId}`);
    },
    customLabel: (
      <div className="flex text-sm">
        <p className="font-medium leading-5 text-gray-400">Status : </p>
        <p className="mx-1 font-medium leading-5 text-gray-700">2 Selected</p>
      </div>
    ),
  },
};

export const IconMenu: Story = {
  args: {
    buttonType: "custom",
    options: menuIconOptions,
    onMenuChange: (menuId: string) => {
      console.log(`Selected menu option: ${menuId}`);
    },
    customMenuButton :  <EllipsisVerticalIcon className="h-5 w-5" />,
    enableIcons: true,
  },
};

export const AvatarMenu: Story = {
  args: {
    buttonType: "custom",
    options: menuIconOptions,
    buttonClassName : "mb-2",
    customMenuButton : <Avatar className="w-10 h-10 mt-2" src="https://picsum.photos/id/237/200/200" alt="Avatar" />,
    onMenuChange: (menuId: string) => {
      console.log(`Selected menu option: ${menuId}`);
    },
  },
};

export const DarkVariant: Story = {
  args: {
    label: "Organization",
    buttonVariants: { variant: "dark" },
    options: menuIconOptions,
  },
};

export const Search: Story = {
  args: {
    label: "Organization",
    options: menuIconOptions,
    enableSearch: true,
    containerVariants: { align: "left" },
    onMenuChange: (menuId: string) => {
      console.log(`Selected menu option: ${menuId}`);
    },
  },
};
