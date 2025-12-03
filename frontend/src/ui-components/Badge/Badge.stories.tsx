import { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";
import { BadgeProps } from "./types";
import { CurrencyDollarIcon } from "@heroicons/react/20/solid";

const meta: Meta = {
  title: "Design System/Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `This is a Badge component`,
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "secondary", "destructive", "outline"],
    },
  },
};

export default meta;
type Story = StoryObj<BadgeProps>;

export const Success: Story = {
  args: {
    variant: "success",
    label: "Approved",
    icon: <CurrencyDollarIcon className="w-5 h-5 pr-1" />
  },
};

export const Rejected: Story = {
  args: {
    variant: "error",
    label: "Rejected",
    rounded: "full",
  },
};

export const OnHold: Story = {
  args: {
    variant: "orange",
    label: "On Hold",
    rounded: "full",
  },
};

export const Awaiting: Story = {
  args: {
    variant: "purple",
    label: "Awaiting",
    rounded: "full",
  },
};

export const Archieved: Story = {
  args: {
    variant: "gray",
    label: "Archieved",
    rounded: "full",
  },
};

export const Retriggered: Story = {
  args: {
    variant: "yellow2",
    label: "Pending",
    rounded: "full",
    additionalClass: "inline-flex items-center px-2 py-1 text-xs font-medium ring-1 ring-inset capitalize"
  },
};
