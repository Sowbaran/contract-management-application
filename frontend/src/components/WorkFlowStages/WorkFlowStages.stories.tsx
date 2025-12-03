import type { Meta, StoryObj } from "@storybook/react";

import { WorkFlowStages } from ".";

const meta = {
  title: "WorkFlowStages",
  component: WorkFlowStages,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof WorkFlowStages>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    steps: [
      {
        name: "Egm-Technology ",
        level: "0",
        status: "completed",
      },
      {
        name: "Technology",
        level: "1",
        status: "current",
      },
      {
        name: "Legal",
        level: "2",
        status: "completed",
      },
      {
        name: "Insurance",
        level: "3",
        status: "rejected",
      },
      {
        name: "Finance",
        level: "4",
        status: "pending",
      },
      {
        name: "CFO",
        level: "5",
        status: "fulfilled",
      },
    ],
  },
};
