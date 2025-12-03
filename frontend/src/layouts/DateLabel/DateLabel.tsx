import { Controller } from "react-hook-form";
import { cn } from "../../utils";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { DateLabelProps } from "./types";

export const DateLabel = ({
  formName = "",
  htmlFor,
  labelProps = {
    lblColor: "slate",
    lblSize: "sm"
    // fontWeight: "light"
  },
  lblText,
  formConfig,
  required = false,
  errorMessage = "",
  mainContainerStyle,
  selectedDate = undefined,
  ...props
}: DateLabelProps) => {
  const { control } = formConfig || {};

  return (
    <div className={cn("flex flex-col w-full", mainContainerStyle)}>
      <div className="flex flex-row items-center mb-2 justify-between">
        <label htmlFor={htmlFor} className={cn(labelProps.className, "text-gray-900 text-md")}>
          {`${lblText} `}
          {required && <span className="text-red-600 ml-1 text-md">{"*"}</span>}
        </label>
      </div>
      <Controller
        name={formName}
        control={control}
        defaultValue={new Date().toISOString()}
        render={({ field }) => (
          <DatePicker
            id={formName}
            selected={selectedDate || (field.value ? new Date(field.value) : null)}
            onChange={date => {
              field.onChange(date);
            }}
            className="ml-2 w-[95%] max-h-[34px] outline-none text-sm"
            showIcon
            calendarIconClassname="h-4 w-4 fill-primary-600"
            wrapperClassName="ring-1 ring-inset ring-gray-300 rounded-md text-gray-900 w-full h-[36px] flex items-center"
            minDate={new Date(props.minDate !== undefined ? props.minDate : "")}
            maxDate={new Date(new Date().getFullYear() + 10, 11, 31)}
            dateFormat="dd/MM/yyyy"
          />
        )}
      />
    </div>
  );
};
