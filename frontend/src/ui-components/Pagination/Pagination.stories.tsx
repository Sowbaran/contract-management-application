import type { Meta, StoryObj } from "@storybook/react";

import { useState } from "react";
import { Pagination } from "./Pagination";
import { PaginationProps, Sorting } from "./types";

const meta = {
  title: "Design System/Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<PaginationProps>;

export default meta;

type Story = StoryObj<typeof meta>;

const Template = ({ totalRowCount, rowPerPage }: PaginationProps) => {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(rowPerPage);

  return (
    <Pagination
      totalRowCount={totalRowCount}
      start={pageNo}
      rowPerPage={pageSize}
      onPageChange={(no: number) => setPageNo(no)}
      onPageSizeChange={(size: number) => setPageSize(size)}
    />
  );
};

export const Default: Story = {
  render: args => <Template {...args} />,

  args: {
    totalRowCount: 100,
    start: 0,
    rowPerPage: 10,
    sorting: [{ id: "name", desc: false }],
    onPageChange: (start: number) => console.log(`Navigating to page ${start / 10 + 1}`),
    onPageSizeChange: (size: number) => console.log(`Rows per page changed to ${size}`),
    onSortChange: (sorting: Sorting[]) => console.log(`Sorting changed to ${sorting}`),
  },
};
