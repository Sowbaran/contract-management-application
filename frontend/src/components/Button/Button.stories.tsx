import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '.'

const meta: Meta<typeof Button> = {
  title: 'Button',
  component: Button,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen'
  }
}

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    type: "submit",
    label: "submit",
    colour:"red",
  }
};
