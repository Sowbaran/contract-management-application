import type { Meta, StoryObj } from "@storybook/react";

import { useState } from "react";
import { Checkbox } from "../Checkbox";
import { TextArea } from "../TextArea";
import { Tabs } from "./Tabs";
import { tabsData } from "./data";
import { TabGroupProp, TabProp } from "./types";

const meta = {
  title: "Design System/Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `This is a Tabs component`,
      },
    },
  },
} satisfies Meta<TabGroupProp>;

export default meta;

type Story = StoryObj<typeof meta>;

const Template: React.FC<TabGroupProp> = ({ tabList }) => {
  const [tabItem, setTabItem] = useState<TabProp>({
    id: "tab1",
    name: "Personal Details",
  });

  const onHandleChange = (item: TabProp) => {
    setTabItem(item);
  };

  return (
    <div className="w-full flex flex-col justify-start">
      <Tabs selectedTab={tabItem.id} tabList={tabList} className="mt-10" onTabChange={onHandleChange} />
      <div className="block">
        {tabItem?.id === "tab1" ? (
          <div className="m-3">
            Storybook runs alongside your app in development mode. It helps you build UI
            components isolated from the business logic and context of your app. This
            edition of the Intro to Storybook tutorial is for React; other editions
          </div>
        ) : tabItem?.id === "tab2" ? (
          <div className="m-3">
            <TextArea className="min-w-[200px] my-2" placeholder="Sample text area" />
            <TextArea className="min-w-[200px] my-2" placeholder="Sample text area" />
            <TextArea className="min-w-[200px] my-2" placeholder="Sample text area" />
          </div>
        ) : (
          <div className="m-3">
            <Checkbox label="TodoList 1" />
            <Checkbox label="TodoList 2" />
            <Checkbox label="TodoList 3" />
            <Checkbox label="TodoList 4" />
            <Checkbox label="TodoList 5" />
          </div>
        )}
      </div>
    </div>
  );
};

export const Default: Story = {
  args: {
    tabList: tabsData,
    containerStyle: "mt-10 m-5",
    variants : "default",
    
  },
};

export const WithContent: Story = {
  render: args => <Template {...args} />,
  args: {
    tabList: tabsData,
  },
};

export const Dark: Story = {
  render: args => <Template {...args} />,
  args: {
    tabList: tabsData,
    containerStyle: "mt-10 p-5 bg-black",
    variants : "dark",
    
  },
};
