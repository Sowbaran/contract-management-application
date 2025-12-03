import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from ".";

const meta = {
  title: "Sidebar",
  component: Sidebar,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      // Add more sidebar items as needed
    ],
    userPermissions: [
      "viewHome",
      "viewFinance",
      "viewPandC",
      "viewUserManagement",
    ],
    sidebarOpen: true,
    setSidebarOpen: (open) => console.log("Sidebar open:", open),
    userName: "John Doe",
    handleShow: () => console.log("Showing profile"),
    handleLogoutPopup: () => console.log("Logging out"),
    handleKeyPress: (event) => console.log("Key pressed:", event.key),
  },
};
