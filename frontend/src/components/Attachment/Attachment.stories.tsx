import type { Meta, StoryObj } from '@storybook/react';

import { Attachment } from '.'

const meta = {
  title: 'Attachment',
  component: Attachment,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen'
  }
} satisfies Meta<typeof Attachment>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "test name",
    message: "test message"
  }
};
