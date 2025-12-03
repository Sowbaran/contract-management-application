import type { Meta, StoryObj } from "@storybook/react";

import { Label } from ".";
import { LabelProps } from "./types";
import { Input } from "../Input";
import { EnvelopeIcon , ExclamationCircleIcon } from "@heroicons/react/24/outline";

const meta: Meta<LabelProps> = {
  title: "Design System/Components/Label",
  component: Label,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
    design: {
      type: "figma",
      url: ``,
    },
    docs: {
      description: {
        component: `This is a Label component`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Template = () => {
  return (
    <div className="p-2">
      <Label text="First Name" lblColor="slate" lblSize="sm" />
      <Input
        variant="default"
        placeholder="First Name"
        
        iconLeft={<EnvelopeIcon className="font-semibold text-slate-500 h-5 w-5" />}
        iconRight={<ExclamationCircleIcon className="font-semibold text-error-500 h-5 w-5" />}
        inputPad="both"
      />
    </div>
  );
};

export const Default: Story = {
  args: {
    text: "Label",
    lblColor: "primary",
    lblSize: "sm",
  },
};

export const LabelWithInput: Story = {
  args: {},
  render: () => <Template />,
};
