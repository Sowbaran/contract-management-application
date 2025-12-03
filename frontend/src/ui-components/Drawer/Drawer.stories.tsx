import type { Meta, StoryObj } from "@storybook/react";

import { useState } from "react";
import { Button } from "../Button";
import { Input } from "../Input";
import { Drawer } from "./Drawer";
import { DrawerProps } from "./types";
import { Label } from "../Label";
import { Menu } from "../Menu";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { MultiSelect } from "../MultiSelect";
import { carsData } from "../MultiSelect/data";

const meta = {
  title: "Design System/Components/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: {
      type: "figma",
      url: ``,
    },
    docs: {
      description: {
        component: `This is a Drawer component`,
      },
    },
  },
} satisfies Meta<DrawerProps>;

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
        <Button
          label="Open Drawer"
          type="button"
          color="blue"
          className="pointer-events-auto h-[40px]"
          onClick={() => setOpen((prev) => !prev)}
        />
        <div>
          <Input variant={"default"} placeholder="Search" className="w-67" />
        </div>
      </div>
      <Drawer
        open={open}
        handleOpen={handleDrawerOpen}
        enableZindex={enableZindex}
        mainContentStyle="overflow-y-auto"
        headerContent={
          <div className="bg-green-300 flex-1 flex">

          </div>
        }
        mainContent={
          <div className=" p-3">
            {dataModule.map(() => (
              // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
              <div className="flex flex-row items-center justify-center gap-4">
                <div className="basis-1/2">
                  <Label
                    text="Module"
                    lblColor="slate"
                    lblSize="sm"
                    className="mb-1"
                  />
                  <Menu
                    selectedId=""
                    labelStyle="text-slate-500 text-sm"
                    mainContClassName="w-full"
                    buttonClassName="w-full"
                    label={"Module"}
                    containerVariants={{ align: "right" }}
                    options={data}
                    onMenuChange={() => { }}
                  />
                </div>
                <div className="basis-1/2">
                  <Label
                    text="Access"
                    lblColor="slate"
                    lblSize="sm"
                    className="mb-1"
                  />
                  <Menu
                    selectedId=""
                    labelStyle="text-slate-500 text-sm"
                    mainContClassName="w-full"
                    buttonClassName="w-full"
                    label={"Access"}
                    containerVariants={{ align: "right" }}
                    containerClassName="min-w-[400px]"
                    options={[]}
                    onMenuChange={() => { }}
                  />
                  <div className="m-4">
                    <MultiSelect placeholder={"Selecte Options....."} options={carsData} />
                  </div>
                  </div>
                  <Menu
                    buttonType="custom"
                    mainContClassName="mt-7"
                    customMenuButton={
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    }
                    enableIcons={true}
                    options={[]}
                    onMenuChange={() => { }}
                  />
                </div>
            ))}
              </div>
        }
      />
          </div>
  );
};

      function DrawerChildren() {
  return (
      <div className="pt-5">
        <div className="flex flex-col gap-1 mt-2 mx-6">
          <div className="flex justify-between">
            <label htmlFor="search" className="block text-md text-white">
              FILTERS
            </label>
            <button type="button" className="block text-sm text-gray-400">
              Clear All
            </button>
          </div>

          <Input
            variant="default"
            id="search"
            name="search"
            type="text"
            placeholder="Search"
          />

        </div>
      </div>
      );
}

      export const Default: Story = {
        args: {
        children: DrawerChildren(),
      enableZindex: false,
  },
  render: () => <Template />,
};

      export const Overlap: Story = {
        args: {
        // children: DrawerChildren(),
        enableZindex: true,
  },
  render: (args) => <Template {...args} />,
};

      const data = [
      {
        label: "contract",
      id: "contract",
  },
      {
        label: "value1",
      id: "value1",
  },
      {
        label: "value2",
      id: "value2",
  }
      ];


      const dataModule = [
      "module1",
      "module2"
      ]
