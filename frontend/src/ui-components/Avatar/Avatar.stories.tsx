import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";

const meta: Meta = {
  title: "Design System/Components/Avatar",
  tags: ["autodocs"],
  component: Avatar,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  parameters: {
    layout: "fullscreen",
    design: {
      type: "figma",
      url: "", // Add your Figma URL here if available
    },
    docs: {
      description: {
        component: "This is an Avatar component.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    initials: "JD",
  },
};

export const WithImage: Story = {
  args: {
    src: "https://picsum.photos/id/237/200/200",
    alt: "Avatar image",
  },
};

export const Square: Story = {
  args: {
    initials: "JD",
    square: true,
  },
};

export const AvatarButton = {
  args: {},
};
