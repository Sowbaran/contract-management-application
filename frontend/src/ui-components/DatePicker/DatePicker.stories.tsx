import type { Meta, StoryObj } from "@storybook/react";
import { DatePickerComponent } from ".";

const meta = {
  title: "Design System/Components/DatePicker",
  component: DatePickerComponent,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: {
      type: "figma",
      url: ``,
    },
    docs: {
      description: {
        component: `This is a DatePicker component`,
      },
    },
  },

  argTypes: {
    showIcon: {
      control: "boolean",
    },
    dateFormat: {
      control: { type: "select" },
      options: [
        "dd/MM/yyyy",
        "MM/dd/yyyy",
        "yyyy/MM/dd",
        "dd-MM-yyyy",
        "MM-dd-yyyy",
        "yyyy-MM-dd",
      ],
      if: { arg: "calendarType", eq: "DatePicker" },
    },
    calendarStartDay: {
      control: { type: "select" },
      options: ["Sunday", "Monday", "Tuesday", "Wednessday", "Thursday", "Friday", "Saturday"],
      if: { arg: "calendarType", eq: "DatePicker" },
    },
    todayButton: {
      control: "boolean",
      if: { arg: "calendarType", eq: "DatePicker" },
    },
    minDate: {
      control: "date",
      if: { arg: "calendarType", eq: "DatePicker" },
    },
    maxDate: {
      control: "date",
      if: { arg: "calendarType", eq: "DatePicker" },
    },
    calendarType: {
      control: { type: "select" },
      options: ["DatePicker", "YearPicker", "MonthPicker"],
    },
  },
} satisfies Meta<typeof DatePickerComponent>;

export default meta;


type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selected: new Date(),
    calendarType: "DatePicker",
    containerStyle: "m-1",
    dateFormat: "dd-MM-yyyy",
  },
};

export const DatePicker: Story = {
  args: {
    selected: new Date(),
    calendarType: "DatePicker",
    containerStyle: "m-1",
    dateFormat: "dd-MM-yyyy",
  },
};

export const MonthPicker: Story = {
  args: {
    selected: new Date(),
    calendarType: "MonthPicker",
    containerStyle: "m-1",
    dateFormat: "dd-MM-yyyy",
  },
};

export const YearPicker: Story = {
  args: {
    selected: new Date(),
    calendarType: "YearPicker",
    containerStyle: "m-1",
    dateFormat: "dd-MM-yyyy",
  },
};

export const ShowIcon: Story = {
  args: {
    selected: new Date(),
    calendarType: "DatePicker",
    containerStyle: "m-1",
    showIcon: true,
  },
};

export const DateFormat: Story = {
  args: {
    selected: new Date(),
    calendarType: "DatePicker",
    containerStyle: "m-1",
    dateFormat: "MM-dd-yyyy",
  },
};

export const TodayButton: Story = {
  args: {
    selected: new Date(),
    calendarType: "DatePicker",
    containerStyle: "m-1",
    todayButton: true,
  },
};

export const CalendarStartDay: Story = {
  args: {
    selected: new Date(),
    calendarType: "DatePicker",
    containerStyle: "m-1",
    calendarStartDay: "Sunday",
  },
};

export const FromDate: Story = {
  args: {
    selected: new Date(),
    calendarType: "DatePicker",
    containerStyle: "m-1",
    minDate: new Date("2025-1-1"),
  },
};

export const DateRange: Story = {
  args: {
    selected: new Date(),
    calendarType: "DatePicker",
    containerStyle: "m-1",
    minDate: new Date("2025-1-1"),
    maxDate: new Date("2025-1-30"),
  },
};


