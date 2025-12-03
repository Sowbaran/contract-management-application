import type { Meta, StoryObj } from "@storybook/react";

import { RadioOptions } from ".";

const meta = {
  title: "RadioOptions",
  component: RadioOptions,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof RadioOptions>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id:"radio_btn", 
    name:'name', 
    options: [{id:"option1" , text:"Option1"}],
  },
};
