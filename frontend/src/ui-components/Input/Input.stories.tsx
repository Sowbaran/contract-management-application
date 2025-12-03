import type { Meta, StoryObj } from "@storybook/react";

import { EnvelopeIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Input } from ".";
import { InputProps } from "./types";

const meta: Meta<InputProps> = {
  title: "Design System/Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `This is a Input component`,
      },
    },
  },
  argTypes: {
    variant: {
      control: {
        type: "select",
      },
      options: ["default", "error"],
    },
    disabled: {
      control: "boolean",
    },
    iconLeft: {
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
    placeholder: "place holder",
    containerVar: { outerMargin: "md" },
  },
};

export const Disable: Story = {
  args: {
    variant: "default",
    placeholder: "place holder",
    value: "Disabled",
    disabled: true,
  },
};

export const ErrorVariant: Story = {
  args: {
    variant: "error",
    placeholder: "place holder",
  },
};

export const UsingIcon: Story = {
  args: {
    variant: "default",
    placeholder: "Text",
    iconLeft: <EnvelopeIcon className="font-semibold text-slate-500 h-5 w-5" />,
    iconRight: <ExclamationCircleIcon className="font-semibold text-error-500 h-5 w-5" />,
    inputPad: "both",
  },
};

export const CustomSize: Story = {
  args: {
    variant: "default",
    placeholder: "place holder",
    className: "w-200 h-[200px]",
  },
};
