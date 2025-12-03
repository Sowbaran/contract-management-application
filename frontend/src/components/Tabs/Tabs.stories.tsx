import type { Meta, StoryObj } from '@storybook/react';

import { Tabs } from '.'

const meta = {
  title: 'Tabs',
  component: Tabs,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen'
  }
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onTabClick: () => { },
    tabs: [
      { name: "My Requests", value: "myform", current: true },
      { name: "Team Requests", value: "teamForm", current: false },
      { name: "Approve Requests", value: "myapproval", current: false }
    ]
  }
};
