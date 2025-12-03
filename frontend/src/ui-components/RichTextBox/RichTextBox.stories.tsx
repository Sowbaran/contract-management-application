import type { Meta, StoryObj } from "@storybook/react";
import { RichTextBox } from ".";
import { useState } from "react";

const meta = {
  title: "Design System/Components/RichTextBox",
  component: RichTextBox,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: {
      type: "figma",
    },
    docs: {
      description: {
        component: `This is a RichTextBox component`,
      },
    },
  },
} satisfies Meta<typeof RichTextBox>;

export default meta;

type Story = StoryObj<typeof meta>;

const Template = () => {
  const [valueInput, setValueinput] = useState("");
  const handleChange = (val: string) => {
    setValueinput(val);
    console.log(valueInput);
  };
  return (
    <div>
      <RichTextBox
        name={""}
        placeholder="Others"
        value={valueInput}
        onChange={handleChange}
      />
    </div>
  );
};

export const Default: Story = {
  args: {
    value: "",
    onChange: () => {},
  },
  render: () => <Template />,
};
