import type { Meta, StoryObj } from "@storybook/react";

import { Table } from ".";

const meta = {
  title: "Table",
  component: Table,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fields: [
      {
        name: "name",
        label: "Name",
        formatter: (value: unknown) => `${value}`,
      },
      {
        name: "email",
        label: "Email",
        formatter: (value: unknown) => `${value}`,
      },
      {
        name: "age",
        label: "Age",
        formatter: (value: unknown) => `${value} years`,
      },
    ],
    data: [
      {
        name: "John Doe",
        email: "john@example.com",
        age: 30,
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        age: 25,
      },
      {
        name: "Bob Johnson",
        email: "bob@example.com",
        age: 35,
      },
      {
        name: "John Doe",
        email: "john@example.com",
        age: 30,
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        age: 25,
      },
      {
        name: "Bob Johnson",
        email: "bob@example.com",
        age: 35,
      },
      {
        name: "John Doe",
        email: "john@example.com",
        age: 30,
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        age: 25,
      },
      {
        name: "Bob Johnson",
        email: "bob@example.com",
        age: 35,
      },
      {
        name: "John Doe",
        email: "john@example.com",
        age: 30,
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        age: 25,
      },
      {
        name: "Bob Johnson",
        email: "bob@example.com",
        age: 35,
      },
      {
        name: "John Doe",
        email: "john@example.com",
        age: 30,
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        age: 25,
      },
      {
        name: "Bob Johnson",
        email: "bob@example.com",
        age: 35,
      },
      {
        name: "John Doe",
        email: "john@example.com",
        age: 30,
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        age: 25,
      },
      {
        name: "Bob Johnson",
        email: "bob@example.com",
        age: 35,
      },
      {
        name: "John Doe",
        email: "john@example.com",
        age: 30,
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        age: 25,
      },
      {
        name: "Bob Johnson",
        email: "bob@example.com",
        age: 35,
      },
      {
        name: "John Doe",
        email: "john@example.com",
        age: 30,
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        age: 25,
      },
      {
        name: "Bob Johnson",
        email: "bob@example.com",
        age: 35,
      },
    ],
    buttonComponent: true,
    title: "Table Titile",
    description: "Table Description",
    pagination: {
      totalRowCount: 15,
      start: 0,
      size: 5,
      sorting: [{ id: "name", desc: false }],
    },
    onPageChange: (start) => console.log("Page changed to:", start),
    onPageSizeChange: (size) => console.log("Page size changed to:", size),
    onSortChange: (sorting) => console.log("Sort changed to:", sorting),
  },
};
