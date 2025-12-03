import type { Meta, StoryObj } from "@storybook/react";

import { ErrorBoundary } from ".";

const meta = {
  title: "ErrorBoundary",
  component: ErrorBoundary,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof ErrorBoundary>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <div>Error Bounday</div>,
  },
};
