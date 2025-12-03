import type { Meta, StoryObj } from "@storybook/react";

import { RichTextInput } from ".";

const meta = {
  title: "Design System/Components/RichTextInput",
  component: RichTextInput,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: {
      type: "figma",
    },
    docs: {
      description: {
        component: `This is a RichTextInput component`,
      },
    },
  },
} satisfies Meta<typeof RichTextInput>;

export default meta;

type Story = StoryObj<typeof meta>;

const Template = () => {
  return (
    <div>
      <RichTextInput
        name={""}
        value={""}
        onChangeIp={val => {
          console.log(val);
        }}
      />
    </div>
  );
};

export const Default: Story = {
  args: {
    name: "editor1",
    value: "",
    onChangeIp: () => {},
  },
  render: () => <Template />,
};
