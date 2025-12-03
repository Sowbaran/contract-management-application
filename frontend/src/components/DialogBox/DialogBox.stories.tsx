import type { Meta, StoryObj } from '@storybook/react';

import { DialogBox } from '.'

const meta = {
  title: 'DialogBox',
  component: DialogBox,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen'
  }
} satisfies Meta<typeof DialogBox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Default Title",
    btnText: "Ok",
    redirectUrl: ""
  }
};
