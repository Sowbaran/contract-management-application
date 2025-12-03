import type { Meta, StoryObj } from "@storybook/react";

import { Pagination } from ".";
import { Sorting } from "./types";

const meta = {
  title: "Pagination",
  component: Pagination,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  // Mocking the onChange function
  args: {
    totalRowCount: 100,
    start: 0,
    size: 10,
    sorting: [{ id: "name", desc: false }],
    onPageChange: (start: number) =>
      console.log(`Navigating to page ${start / 10 + 1}`),
    onPageSizeChange: (size: number) =>
      console.log(`Rows per page changed to ${size}`),
    onSortChange: (sorting: Sorting[]) =>
      console.log(`Sorting changed to ${sorting}`),
  },
};
