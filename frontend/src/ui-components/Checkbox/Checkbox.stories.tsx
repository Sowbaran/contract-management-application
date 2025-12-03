import type { Meta, StoryObj } from "@storybook/react";

import { Checkbox } from ".";
import { CheckboxProps } from "./types";

const meta: Meta<CheckboxProps> = {
  title: "Design System/Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `This is a Checkbox component`,
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Default",
    defaultChecked: false,
  },
};

export const DefaultChecked: Story = {
  args: {
    label: "Default",
    defaultChecked: true,
  },
};

export const WithoutLabel: Story = {
  args: {
    label: "Default",
    defaultChecked: true,
    enableLabel: false,
  },
};
