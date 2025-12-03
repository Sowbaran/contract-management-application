import type { Meta, StoryObj } from "@storybook/react";
import { TextArea } from "./TextArea";
import { TextareaProps } from "./types";

const meta: Meta<TextareaProps> = {
  title: "Design System/Components/Textarea",
  component: TextArea,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `This is a Textarea component`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter your text...",
    additionalStyles:{containerStyle:"m-5"}
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Enter your text...",
    disabled: true,
    additionalStyles:{containerStyle:"m-5"}
  },
};

export const WithError: Story = {
  args: {
    placeholder: "Enter your text...",
    additionalStyles:{containerStyle:"m-5"}
  },
};

export const CustomHeight: Story = {
  args: {
    placeholder: "Enter your text...",
    style: { minHeight: "150px" },
    additionalStyles:{containerStyle:"m-5"}
  },
};

export const ReadOnly: Story = {
  args: {
    placeholder: "Read-only text...",
    readOnly: true,
    value: "This text is read-only.",
  },
};

export const PreFilled: Story = {
  args: {
    value: "This is pre-filled text.",
  },
};
