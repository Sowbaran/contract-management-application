import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "./RadioGroup";
import { RadioGroupProps, RadioOption } from "./types";
import { dynamicOptions, dynamicOptionsDisabled } from "./data";

const meta: Meta<typeof RadioGroup> = {
  title: "Design System/Components/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `This is a RadioGroup component`,
      },
    },
  },

  argTypes: {
    orientation: {
      control: { type: "select" },
      options: ["horizontal", "vertical"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Template = ({
  dynamicOptions,
  ...args
}: { dynamicOptions: RadioOption[] } & RadioGroupProps) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  console.log("value ---- ", selectedOption);
  return (
    <RadioGroup {...args}>
      {dynamicOptions.map(option => (
        <RadioGroupItem
          name="radio-group"
          size="md"
          key={option.value}
          value={option.value}
          checked={option.value === selectedOption}
          disabled={option.disabled}
          description={option.description}
          radioContainerStyle="w-full"
          innerCheckedStyle="bg-yellow-400"
          outerCheckedStyle="border-yellow-400 peer-focus:ring-4 peer-focus:ring-yellow-100"
          outerRingStyle="hover:border-yellow-400"
          onChange={event => setSelectedOption(event.target.value)}
        >
          {option.label}
          <br />
          {option.description}
        </RadioGroupItem>
      ))}
    </RadioGroup>
  );
};

export const Default: Story = {
  render: args => <Template dynamicOptions={dynamicOptions} {...args} />,
  args: {
    className: "flex flex-col gap-4",
    orientation: "vertical",
  },
};

export const Orientation: Story = {
  render: args => <Template dynamicOptions={dynamicOptions} {...args} />,
  args: {
    className: "flex flex-col gap-4",
    orientation: "horizontal",
  },
};

export const Disabled: Story = {
  render: args => <Template dynamicOptions={dynamicOptionsDisabled} {...args} />,
  args: {
    className: "flex flex-col gap-4",
    orientation: "vertical",
  },
};
