import type { Meta, StoryObj } from "@storybook/react";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Dialog } from "./Dialog";
import { DialogProps } from "./types";

const meta = {
  title: "Design System/Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `This is a Dialog component`,
      },
    },
  },
} satisfies Meta<DialogProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const buttonItems = [
  {
    id: "ok",
    name: "Ok",
    style:
      "min-w-[50px] inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto",
  },
  {
    id: "cancel",
    name: "Cancel",
    style:
      "mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto",
  },
];

export const Default: Story = {
  args: {
    title: "Alert",
    content:
      "Are you sure you want to deactivate your account? All of your data will be permanently removed.This action cannot be undone.",
    buttonActions: buttonItems,
    icon: (
      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
        <ExclamationTriangleIcon aria-hidden="true" className="h-6 w-6 text-red-600" />
      </div>
    ),
  },
};
