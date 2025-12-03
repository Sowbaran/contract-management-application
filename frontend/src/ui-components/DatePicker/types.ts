export type DatePickerProps = {
  showIcon?: boolean;
  dateFormat?: string;
  selected?: Date;
  calendarStartDay?: string;
  todayButton?: boolean;
  calendarType: "DatePicker" | "YearPicker" | "MonthPicker";
  minDate?: Date;
  maxDate?: Date;
  containerStyle?: string;
};
