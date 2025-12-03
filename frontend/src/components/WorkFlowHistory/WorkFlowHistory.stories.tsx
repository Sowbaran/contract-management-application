import type { Meta, StoryObj } from "@storybook/react";

import { WorkFlowHistory } from ".";

const meta = {
  title: "WorkFlowHistory",
  component: WorkFlowHistory,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof WorkFlowHistory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    workflowHistory: [
      {
        approvedBy: "rvijayakumar@nrl.com.au",
        createdAt: 1713923066962,
        department: "65e391006d98432f2ac48ab8",
        departmentName: "Integrity",
        status: "initiated",
        workflowName: "Executive General Manager",
      },
      {
        approvedBy: "sdharmaraj@nrl.com.au",
        status: "approved",
        department: "65e390e26d98432f2ac48ab6",
        createdAt: 1713935184635,
        departmentName: "FanX - Digital",
      },
      {
        approvedBy: "aupton@nrl.com.au",
        status: "approved",
        department: "65e390e26d98432f2ac48ab6",
        createdAt: 1713935206451,
        departmentName: "Technology",
      },
      {
        approvedBy: "aupton@nrl.com.au",
        status: "approved",
        department: "65e390e26d98432f2ac48ab6",
        createdAt: 1713935260531,
        departmentName: "Legal",
      },
      {
        approvedBy: "aupton@nrl.com.au",
        status: "approved",
        department: "65e390e26d98432f2ac48ab6",
        createdAt: 1713935354849,
        departmentName: "Insurance",
      },
      {
        approvedBy: "aupton@nrl.com.au",
        status: "rejected",
        department: "65e390e26d98432f2ac48ab6",
        createdAt: 1713935440788,
        comments: "the number does not agree",
        departmentName: "Finance",
      },
      {
        approvedBy: "rvijayakumar@nrl.com.au",
        status: "initiated",
        department: "65e391c36d98432f2ac48abd",
        createdAt: 1713935538093,
        departmentName: "Finance",
      },
      {
        approvedBy: "aupton@nrl.com.au",
        status: "approved",
        department: "65e390e26d98432f2ac48ab6",
        createdAt: 1713936197767,
        departmentName: "Finance",
      },
      {
        approvedBy: "aupton@nrl.com.au",
        status: "completed",
        department: "65e390e26d98432f2ac48ab6",
        createdAt: 1713936243365,
        departmentName: "CFO",
      },
      {
        approvedBy: "rvijayakumar@nrl.com.au",
        status: "fulfilled",
        department: "65e390e26d98432f2ac48ab6",
        createdAt: 1713936343679,
        departmentName: "CFO",
      },
    ],
  },
};
