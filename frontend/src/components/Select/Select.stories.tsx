import type { Meta, StoryObj } from "@storybook/react";

import { Select } from ".";

const meta = {
  title: "Select",
  component: Select,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "select-item",
    name: "string",
    options: [
      { label: "Select Department", value: 1 },
      { label: "Technology", value: 1 },
      { label: "Finance", value: 2 },
      { label: "Legal", value: 3 },
    ],
    onChange: (value: string) => console.log(value), // Specify the type of 'value' as 'string'
  },
};
