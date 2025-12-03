import type { Meta, StoryFn } from '@storybook/react';
import { CheckboxGroupProps, CheckboxOption } from "./types";
import { CheckboxGroup } from '.'

const meta = {
  title: 'Design System/Components/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `This is a CheckboxGroup component`
      }
    }
  },

  argTypes: {
    orientation: {
      control: { type: "select" },
      options: ["horizontal", "vertical"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md"],
    },
    dynamicOptions: {
      control: "object",
    },
  },

} satisfies Meta<typeof CheckboxGroup>;

export default meta;

interface CheckboxGroupStoryProps extends CheckboxGroupProps {
  dynamicOptions: CheckboxOption[];
}

const Template: StoryFn<CheckboxGroupStoryProps> = ({ dynamicOptions, orientation, ...args }) => {

  const directionClass = (orientation === "horizontal" ? "flex gap-4" : "flex flex-col gap-4");

  return (
    <div className={directionClass}>
      {dynamicOptions.map((option) => (
        <CheckboxGroup
          key={option.value}
          label={option.label}
          description={option.description}
          defaultChecked={option.defaultChecked}
          disabled={option.disabled}
          {...args}
        />
      ))}
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  orientation: "vertical",
  size: "md",
  dynamicOptions: [
    {
      label: "Remember me",
      description: "Save my login details for next time",
      disabled: false,
      defaultChecked: true,
      value: 'Option1'
    },
    {
      label: "Remember me",
      description: "Save my login details for next time",
      disabled: false,
      defaultChecked: false,
      value: 'Option2'
    },
    {
      label: "Remember me",
      description: "Save my login details for next time",
      disabled: false,
      defaultChecked: false,
      value: 'Option3'
    },
    {
      label: "Remember me",
      description: "Save my login details for next time",
      disabled: false,
      defaultChecked: false,
      value: 'Option4'
    },
  ],
};

export const Orientation = Template.bind({});
Orientation.args = {
  orientation: "horizontal",
  size: "md",
  dynamicOptions: [
    {
      label: "Remember me",
      description: "Save my login details for next time",
      disabled: false,
      defaultChecked: true,
      value: 'Option1'
    },
    {
      label: "Remember me",
      description: "Save my login details for next time",
      disabled: false,
      defaultChecked: false,
      value: 'Option2'
    },
    {
      label: "Remember me",
      description: "Save my login details for next time",
      disabled: false,
      defaultChecked: false,
      value: 'Option3'
    },
    {
      label: "Remember me",
      description: "Save my login details for next time",
      disabled: false,
      defaultChecked: false,
      value: 'Option4'
    },
  ],
};

export const Size = Template.bind({});
Size.args = {
  size: "sm",
  orientation: "vertical",
  dynamicOptions: [
    {
      label: "Remember me",
      description: "Save my login details for next time",
      disabled: false,
      defaultChecked: true,
      value: 'Option1'
    },
    {
      label: "Remember me",
      description: "Save my login details for next time",
      disabled: false,
      defaultChecked: false,
      value: 'Option2'
    },
    {
      label: "Remember me",
      description: "Save my login details for next time",
      disabled: false,
      defaultChecked: false,
      value: 'Option3'
    },
    {
      label: "Remember me",
      description: "Save my login details for next time",
      disabled: false,
      defaultChecked: false,
      value: 'Option4'
    },
  ],
};

export const DefaultChecked = Template.bind({});
DefaultChecked.args = {
  orientation: "vertical",
  size: "md",
  dynamicOptions: [
    {
      label: "Remember me",
      description: "Save my login details for next time",
      disabled: false,
      defaultChecked: false,
      value: 'Option1'
    },
    {
      label: "Remember me",
      description: "Save my login details for next time",
      disabled: false,
      defaultChecked: true,
      value: 'Option2'
    },
    {
      label: "Remember me",
      description: "Save my login details for next time",
      disabled: false,
      defaultChecked: false,
      value: 'Option3'
    },
    {
      label: "Remember me",
      description: "Save my login details for next time",
      disabled: false,
      defaultChecked: false,
      value: 'Option4'
    },
  ],
};

export const WithDescription = Template.bind({});
WithDescription.args = {
  orientation: "vertical",
  size: "md",
  dynamicOptions: [
    {
      label: "Remember me",
      description: "Save my login details for next time",
      disabled: false,
      defaultChecked: true,
      value: 'Option1'
    },
    {
      label: "Remember me",
      description: "Save my login details for next time",
      disabled: false,
      defaultChecked: false,
      value: 'Option2'
    },
    {
      label: "Remember me",
      description: "Save my login details for next time",
      disabled: false,
      defaultChecked: false,
      value: 'Option3'
    },
    {
      label: "Remember me",
      description: "Save my login details for next time",
      disabled: false,
      defaultChecked: false,
      value: 'Option4'
    },
  ],
};

export const WithoutDescription = Template.bind({});
WithoutDescription.args = {
  orientation: "vertical",
  size: "md",
  dynamicOptions: [
    {
      label: "Remember me",
      description: "",
      disabled: false,
      defaultChecked: true,
      value: 'Option1'
    },
    {
      label: "Remember me",
      description: "",
      disabled: false,
      defaultChecked: false,
      value: 'Option2'
    },
    {
      label: "Remember me",
      description: "",
      disabled: false,
      defaultChecked: false,
      value: 'Option3'
    },
    {
      label: "Remember me",
      description: "",
      disabled: false,
      defaultChecked: false,
      value: 'Option4'
    },
  ],
};

export const Disabled = Template.bind({});
Disabled.args = {
  orientation: "vertical",
  size: "md",
  dynamicOptions: [
    {
      label: "Remember me",
      description: "Save my login details for next time",
      disabled: false,
      defaultChecked: false,
      value: 'Option1'
    },
    {
      label: "Remember me",
      description: "Save my login details for next time",
      disabled: true,
      defaultChecked: true,
      value: 'Option2'
    },
    {
      label: "Remember me",
      description: "Save my login details for next time",
      disabled: true,
      defaultChecked: true,
      value: 'Option3'
    },
    {
      label: "Remember me",
      description: "Save my login details for next time",
      disabled: false,
      defaultChecked: false,
      value: 'Option4'
    },
  ],
};