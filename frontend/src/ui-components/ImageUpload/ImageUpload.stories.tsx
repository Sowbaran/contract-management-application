import type { Meta, StoryObj } from "@storybook/react";

import { ImageUpload } from "./ImageUpload";
import { ImageUploadProps } from "./types";

const meta = {
  title: "Design System/Components/ImageUpload",
  component: ImageUpload,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: {
      type: "figma",
      url: ``,
    },
    docs: {
      description: {
        component: `This is a FileImage component`,
      },
    },
  },
} satisfies Meta<ImageUploadProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    acceptedFileTypes: ["image/*"],
    label: "Image",
  },
};
