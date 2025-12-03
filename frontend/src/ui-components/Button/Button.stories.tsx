import type { Meta, StoryObj } from "@storybook/react";

import { CogIcon } from "@heroicons/react/20/solid";
import { Button } from ".";
import { ButtonProps } from "./types";

const meta = {
  title: "Design System/Components/Button",
  component: Button,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
    design: {
      type: "figma",
      url: ``,
    },
    docs: {
      description: {
        component: `This is a Button component`,
      },
    },
  },
  argTypes: {
    variant: {
      control: {
        type: "select",
      },
      options: ["primary", "outline", "plain", "green", "greenOutline"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg", "xl", "xxl"],
    },
    fullWidth: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    leftIcon: {
      control: { type: "select" },
      options: ["", "left"],
      mapping: {
        left: <CogIcon className="w-5 h-5" />,
      },
    },
    rightIcon: {
      control: { type: "select" },
      options: ["", "right"],
      mapping: {
        right: <CogIcon className="w-5 h-5" />,
      },
    },
  },
} satisfies Meta<ButtonProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Add New User",
    variant: "primary",
    size: "md",
  },
};

export const Outline: Story = {
  args: {
    label: "Button",
    variant: "outline",
    size: "lg",
  },
};

export const IconLeft: Story = {
  args: {
    label: "Add New User",
    variant: "outline",
    size: "md",
    leftIcon: <CogIcon className="w-5 h-5" />,
  },
};

export const Plain: Story = {
  args: {
    label: "Button CTA",
    variant: "plain",
    size: "xl",
  },
};

export const FullWidth: Story = {
  args: {
    label: "Button",
    variant: "primary",
    size: "xl",
    fullWidth: true,
  },
};

export const IconButton: Story = {
  args: {
    buttonType: "icon",
    leftIcon: <CogIcon className="w-5 h-5" />,
    variant: "primary",
    iconSize: "lg",
  },
};

export const CustomButtonStyle: Story = {
  args: {
    buttonType: "icon",
    leftIcon: <CogIcon className="w-5 h-5" />,
    variant: "plain",
    iconSize: "xl",
    buttonStyle : "hover:bg-transparent",
  },
};
