import { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Select } from "./Select";
import { pages, people } from "./data";
import { SelectProps, SelectValueProps } from "./types";

const meta: Meta<typeof Select> = {
  title: "Design System/Components/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `This is a Select component`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<SelectProps>;

const Template: React.FC<SelectProps> = ({ value, options, placeholder , ...props }) => {
  const [selectedOption, setSelectedOption] = useState(value);

  const handleChange = (newValue: SelectValueProps) => {
    setSelectedOption(newValue);
  };

  return (
    <Select
      value={selectedOption}
      options={options}
      placeholder={placeholder}
      onChange={handleChange}
      {...props}
    />
  );
};

export const Default: Story = {
  render: args => <Template {...args} />,
  args: {
    options: people,
    placeholder: "Select an option",
  },
};

export const Small: Story = {
  args: {
    options: pages,
    placeholder: "Select",
    size: "sm",
  },
};

export const CustomStyling: Story = {
  args: {
    options: pages,
    placeholder: "Select",
    containerStyle: "w-[400px] h-8",
    buttonStyle: "h-8 py-0",
    optionsContainerStyle: "mt-[40px] bg-gray-300",
    optionStyle: "py-8",
  },
};

export const Selected: Story = {
  render: args => <Template {...args} />,
  args: {
    value: people[0],
    options: people,
    placeholder: "Select an option",
    disabled:true
  },
};

export const Search: Story = {
  args: {
    options: people,
    placeholder: "Select an option",
    enableSearch: true,
  },
};
