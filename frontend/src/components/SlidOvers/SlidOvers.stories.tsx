import type { Meta, StoryObj } from "@storybook/react";

import { SlidOvers } from ".";
import { useState } from "react";

const meta = {
  title: "SlidOvers",
  component: SlidOvers,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof SlidOvers>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    heading: "Slidovers",
    children: <div>SlidOver Content</div>,
    isOpen: false,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);

    const openPanel = () => setIsOpen(true);
    const closePanel = () => setIsOpen(false);

    return (
      <>
        <button type="button" onClick={openPanel}>
          Open SlideOver
        </button>
        <SlidOvers {...args} isOpen={isOpen} onClose={closePanel}>
          {args.children}
        </SlidOvers>
      </>
    );
  },
};
