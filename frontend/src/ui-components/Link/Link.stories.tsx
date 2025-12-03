import type { Meta, StoryObj } from "@storybook/react";
import { Link } from "./Link";
import type { LinkProps } from "./types";

const meta = {
  title: "Design System/Components/Link",
  component: Link,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: {
      type: "figma",
      url: "", // Add Figma URL if available
    },
    docs: {
      description: {
        component: "This is a Link component",
      },
    },
  },
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<LinkProps>;

export const Default: Story = {
  args: {
    href: "#",
    children: "Default Link",
  },
};

export const WithExternalLink: Story = {
  args: {
    href: "https://example.com",
    target: "_blank",
    rel: "noopener noreferrer",
    children: "External Link",
  },
};

export const ButtonLink: Story = {
  args: {
    href: "#",
    className: "btn btn-primary",
    children: "Button Link",
  },
};
