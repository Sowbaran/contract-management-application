import type { Meta, StoryObj } from "@storybook/react";

import { useState } from "react";
import { Accordion } from "./Accordion";
import { AccordionProps } from "./types";

const meta = {
  title: "Design System/Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<AccordionProps>;

export default meta;

type Story = StoryObj<typeof meta>;

const Template: React.FC = ({ ...args }) => {
  const [id, setId] = useState("0");
  const onHandleChange = (oid: string) => {
    setId(oid);
  };
  return (
    <div className="flex flex-col gap-2">
      <Accordion
        openId="1"
        headerLabel="Accordion1"
        {...args}
        selectedId={id}
        onToggle={onHandleChange}
      >
        <div>
          Note that there are disadvantages in writing stories like this as you cannot
          take full advantage of the args mechanism and composing args as you build even
          more complex composite components. For more discussion, see the multi component
          stories workflow documentation.
        </div>
      </Accordion>
      <Accordion
        openId="2"
        headerLabel="Accodion2"
        {...args}
        selectedId={id}
        onToggle={onHandleChange}
      >
        <div>
          Note that there are disadvantages in writing stories like this as you cannot
          take full advantage of the args mechanism and composing args as you build even
          more complex composite components. For more discussion, see the multi component
          stories workflow documentation.
        </div>
      </Accordion>
    </div>
  );
};

export const Default: Story = {
  render: () => <Template />,
  args: {},
};

export const Integrity: Story = {
  render: args => <Template {...args} />,
  args: {
    variant: "integrity",
  },
};

export const Custom: Story = {
  render: args => <Template {...args} />,
  args: {
    variant: "integrity",
    headerStyle:"bg-primary-600",
    headerBtnStyle:"text-white"
  },
};
