import type { Meta, StoryObj } from "@storybook/react";

import { SideBar } from "./SideBar";

import { useState } from "react";
import { footerList, mainList } from "./data";
import { SideBarProps } from "./types";
const meta = {
  title: "Design System/Components/SideBar",
  component: SideBar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: {
      type: "figma",
      url: ``,
    },
    docs: {
      description: {
        component: `This is a SideBar component`,
      },
    },
  },
} satisfies Meta<SideBarProps>;

export default meta;

type Story = StoryObj<typeof meta>;

const Template = ({ ...args }) => {
  const [menuId, setMenuId] = useState("");
  const onMenuChange = (id: string) => {
    setMenuId(id);
  };

  console.log("id ---- ", menuId);
  return (
    <div className="flex">
      <SideBar
        menu={menuId}
        onMenuChange={onMenuChange}
        mainContents={args.mainContents}
        footerContents={args.footerContents}
      />
      {menuId === "home" && <div className="m-2 ">Home Content</div>}
      {menuId === "users" && <div className="m-2">Users Content</div>}
      {menuId === "nav" && <div className="m-2">Nav Content</div>}
      {menuId === "setting" && <div className="m-2">Setting Content</div>}
    </div>
  );
};

export const Default: Story = {
  render: args => <Template {...args} />,
  args: {
    mainContents: mainList,
    footerContents: footerList,
  },
};
