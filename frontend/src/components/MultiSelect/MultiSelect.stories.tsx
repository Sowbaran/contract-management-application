import type { Meta, StoryObj } from '@storybook/react';

import { MultiSelect } from '.'

const meta = {
  title: 'MultiSelect',
  component: MultiSelect,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen'
  }
} satisfies Meta<typeof MultiSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    required: true,
    id: "status",
    placeholder:"Select...",
    name:"Modules",
    options:[],
    defaultValues:[]
  }
};
