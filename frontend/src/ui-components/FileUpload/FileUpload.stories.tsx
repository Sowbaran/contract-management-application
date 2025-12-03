import type { Meta, StoryObj } from "@storybook/react";

import { FileUpload } from ".";

const meta = {
  title: "Design System/Components/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof FileUpload>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    acceptedFileTypes: ".pdf, .doc, .docx, application/pdf, application/msword",
  },
};
