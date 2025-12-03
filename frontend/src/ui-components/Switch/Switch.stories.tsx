import type { Meta, StoryObj } from "@storybook/react";

import { Switch } from "./Switch";

const meta = {
  title: "Design System/Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `This is a Switch component`,
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

const Template = () => {
  const handleOnChange = (id: string, enabled: boolean) => {
    console.log(id + " - " + enabled);
  };
  return <Switch id="1" active={true} onChange={handleOnChange} />;
};
export const Default: Story = {
  args: {
    active: false,
    onChange: () => {},
  },
  render: () => <Template />,
};
