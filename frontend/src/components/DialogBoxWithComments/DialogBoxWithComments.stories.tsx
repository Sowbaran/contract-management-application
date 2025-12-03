import type { Meta, StoryObj } from '@storybook/react';

import { DialogBoxWithComments } from '.'

const meta = {
  title: 'DialogBoxWithComments',
  component: DialogBoxWithComments,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen'
  }
} satisfies Meta<typeof DialogBoxWithComments>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen:true,
    title:"Reject Reason",
    btnText:"reject",
    moduleId:"",
    emailId:"",
    formId:"",
    status:"rejected",
    redirectUrl:""
  }
};
