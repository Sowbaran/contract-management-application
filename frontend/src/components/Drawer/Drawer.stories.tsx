import type { Meta, StoryObj } from "@storybook/react";

import { Drawer } from ".";
import { DrawerProps } from "./types";
import { useState } from "react";

const meta = {
  title: "Drawer",
  component: Drawer,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof Drawer>;

export default meta;

type Story = StoryObj<typeof meta>;

const Template: React.FC<DrawerProps> = ({ enableZindex }) => {
  const [open, setOpen] = useState(false);
  const handleDrawerOpen = (drawerOpen: boolean) => {
    setOpen(drawerOpen);
  };
  return (
    <div className="flex h-[100vh] bg-white">
      <div className="p-2 w-full flex justify-between">
        <button
          type="button"
          color="blue"
          className="pointer-events-auto h-[40px]"
          onClick={() => setOpen((prev) => !prev)}
        >
          Open Drawer
        </button>
        <div>
          <input type="text" placeholder="Search" />
        </div>
      </div>
      <Drawer
        open={open}
        handleOpen={handleDrawerOpen}
        backgroudPanelStyle="w-[400px]"
        headerContentStyle="flex justify-between items-center py-2"
        headerContent={
          <>
            <label className="text-md  font-normal text-black">FILTERS</label>
            <button
              type="button"
              className="text-[10px] text-gray-400 rounded-sm p-1"
              onClick={() => {}}
            >
              Clear All
            </button>
          </>
          // </div>
        }
        enableZindex={enableZindex}
        mainContent={<div>main</div>}
      />
    </div>
  );
};

export const Default: Story = {
  args: {
    enableZindex: true,
  },
  render: (args) => <Template {...args} />,
};
