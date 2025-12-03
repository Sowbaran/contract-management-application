import type { Meta, StoryObj } from '@storybook/react';

import { MultiSelect } from '.'
import { carsData } from './data';
import React, { useState } from 'react';
import { MultiSelectOption, MultiSelectProps } from './types';

const meta = {
  title: 'Design System/Components/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    design: {
      type: "figma",
      url: ``
    },
    docs: {
      description: {
        component: `This is a MultiSelect component`
      }
    }
  }
} satisfies Meta<typeof MultiSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

const Template: React.FC<MultiSelectProps> = ({ ...args }) => {

  const [dispOptions, setDispOptions] = useState<MultiSelectOption[]>([])

  const onSelectChange = (options: MultiSelectOption[]) => {
    setDispOptions(options)
  }

  return (
    <div className='m-4'>
      <MultiSelect values={dispOptions} onChangeCb={onSelectChange} {...args} />
    </div>
  )
}

export const Default: Story = {
  render: (args) => <Template  {...args} />,
  args: {
    options: carsData || [],
    placeholder: "Select Options...",
    maxTextCount: 8
  }
};