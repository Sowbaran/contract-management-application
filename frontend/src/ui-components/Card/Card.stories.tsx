import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";
import { CardProps } from "./types";
import {
  ArrowRightIcon,
} from "@heroicons/react/20/solid"; 
import { CreditCardIcon } from "@heroicons/react/24/outline";
import { Button } from "../Button";

const meta: Meta<CardProps> = {
  title: "Design System/Components/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "",
    },
    docs: {
      description: {
        component: `This is a Card component`,
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "border-0 border-t-4 w-[210px] p-3 px-4",
    colorBg: "green",
    colorBorder: "green",
    mainContent: (
      <div className="flex flex-col">
        <p className="-mb-2 font-medium text-sm text-gray-500">Registered</p>
        <p className="font-medium text-[36px] text-black">2281</p>
      </div>
    ),
  },
};

export const PlayerDetailsCard: Story = {
  args: {
    className:
      " pt-4 shadow-lg w-[318px] h-[257px] flex flex-col justify-between",
    headerMainContainerStyle: "flex flex-col gap-3 ",
    headerContent: (
      <div className="px-4">
        <div className="rounded-md flex justify-center items-center w-[38px] h-[38px] bg-slate-100">
          <CreditCardIcon className="text-[#7E49FF] w-6 h-6" />
        </div>
      </div>
    ),
    mainContent: (
      <div className="px-4 flex flex-col gap-1">
        <p className="font-semibold text-black text-md">1. Personnel Details</p>
        <p className="font-regular text-slate-600 text-sm">
          Provide and verify your personal details such as full name, date of
          birth, and contact information
        </p>
      </div>
    ),
    footerContent: (
      <div className="py-3 border-t border-gray-100">
        <div className="px-4 flex justify-between items-center">
          <div className="flex flex-col">
            <p className="text-[10px] text-slate-400">Last Updated</p>
            <p className="font-medium text-[10px] text-slate-700">
              4th May, 8:30 PM
            </p>
          </div>
          <Button
            size="sm"
            className="bg-[#7E49FF] text-white h-8 "
            label="Update Now"
          />
        </div>
      </div>
    ),
  },
};

export const PlayerNavCard: Story = {
  args: {
    className: "sm:w-[522px] shadow-none border border-gray-300 p-3 pr-0",
    mainContent: (
      <div className="flex flex-row justify-between items-center gap-3">
        <div className="flex items-center">
          <div className="mr-5 inline-flex rounded-md justify-center items-center w-[48px] h-[48px] bg-slate-100">
            <CreditCardIcon className="text-[#7E49FF] w-8 h-8" />
          </div>
          <div className="inline-block">
            <p className=" text-sm text-black">Profile</p>
            <p className="text-sm text-slate-500">Additional Details</p>
          </div>
        </div>
        <div className="flex justify-center items-center w-12 h-12 ">
          <ArrowRightIcon className="text-[#7E49FF] w-5 h-5" />
        </div>
      </div>
    ),
  },
};
