import type { DatePickerProps } from "./types";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePicker.stories";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import { DatePickerStyle } from "./styles";

export function DatePickerComponent({
  showIcon = true,
  dateFormat = "dd/MM/yyyy",
  calendarStartDay = "Monday",
  todayButton = true,
  calendarType,
  minDate = new Date("2000-01-01"),
  maxDate = new Date("2080-12-01"),
  ...props
}: DatePickerProps) {
  const [initialDate, setInitialDate] = useState<Date | null>(new Date());
  const calendarPicker =
    calendarType === "YearPicker"
      ? "yyyy"
      : calendarType === "MonthPicker"
        ? "MM/yyyy"
        : dateFormat;

  const dayToNumberConvertion = (day: string) => {
    switch (day) {
      case "Sunday":
        return 0;
      case "Monday":
        return 1;
      case "Tuesday":
        return 2;
      case "Wednessday":
        return 3;
      case "Thursday":
        return 4;
      case "Friday":
        return 5;
      case "Saturday":
        return 6;
    }
  }

  return (
    <div className={props.containerStyle}>
      <DatePicker
        {...props}
        className="border"
        showIcon={showIcon}
        icon={
          // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fill-rule="evenodd"
              d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
              clip-rule="evenodd"
            />
          </svg>
        }
        dateFormat={calendarPicker}
        selected={initialDate}
        onChange={(date: Date | null) => setInitialDate(date)}
        calendarStartDay={dayToNumberConvertion(calendarStartDay)}
        todayButton={
          calendarType === "DatePicker" && todayButton
            ? "Today"
            : calendarType === "YearPicker" || calendarType === "MonthPicker"
              ? undefined
              : todayButton
        }
        minDate={minDate}
        maxDate={maxDate}
        showYearPicker={calendarType === "YearPicker"}
        showMonthYearPicker={calendarType === "MonthPicker"}
        formatWeekDay={(day: string) => day.substring(0, 3)}
        renderCustomHeader={
          calendarType === "DatePicker"
            ? ({ date, decreaseMonth, increaseMonth, decreaseYear, increaseYear }) => {
              return (
                <>
                  <div className="flex items-center justify-around p-2 h-10">
                    <ChevronDoubleLeftIcon
                      className={`text-slate-300 hover:text-gray-700 w-5 h-10 relative `}
                      onClick={decreaseYear}
                    />

                    <ChevronLeftIcon
                      className={`text-slate-300 hover:text-gray-700 w-5 h-10 relative `}
                      onClick={decreaseMonth}
                    />

                    <span className="text-sm text-gray-900 font-normal font-['inter'] leading-snug">
                      {date.toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>

                    <ChevronRightIcon
                      className={`text-slate-300 hover:text-gray-700 w-5 h-10 relative `}
                      onClick={increaseMonth}
                    />

                    <ChevronDoubleRightIcon
                      className={`text-slate-300 hover:text-gray-700 w-5 h-10 relative `}
                      onClick={increaseYear}
                    />
                  </div>
                  <hr className="border-b-0 border-[#F0F0F0]" />
                </>
              );
            }
            : calendarType === "YearPicker"
              ? ({ date, decreaseYear, increaseYear }) => {
                const currentYear = date.getFullYear();
                const rangeStart = Math.floor((currentYear - 2017) / 12) * 12 + 2017;
                const rangeEnd = rangeStart + 11;

                return (
                  <>
                    <div className="flex items-center justify-around p-2 h-10">
                      <ChevronLeftIcon
                        className={`text-slate-300 hover:text-gray-700 w-5 h-10 relative `}
                        onClick={decreaseYear}
                      />
                      <span className="text-sm text-gray-900 font-normal font-['inter'] leading-snug">{`${rangeStart} - ${rangeEnd}`}</span>
                      <ChevronRightIcon
                        className={`text-slate-300 hover:text-gray-700 w-5 h-10 relative `}
                        onClick={increaseYear}
                      />
                    </div>
                    <hr className="border-b-0 border-[#F0F0F0]" />
                  </>
                );
              }
              : ({ date, decreaseYear, increaseYear }) => {
                const formattedMonthYear = new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                }).format(date);

                return (
                  <>
                    <div className="flex items-center justify-around p-2 h-10">
                      <ChevronLeftIcon
                        className={`text-slate-300 hover:text-gray-700 w-5 h-10 relative `}
                        onClick={decreaseYear}
                      />
                      <span className="text-sm text-gray-900 font-normal font-['inter'] leading-snug">
                        {formattedMonthYear}
                      </span>
                      <ChevronRightIcon
                        className={`text-slate-300 hover:text-gray-700 w-5 h-10 relative `}
                        onClick={increaseYear}
                      />
                    </div>
                    <hr className="border-b-0 border-[#F0F0F0]" />
                  </>
                );
              }
        }
      />

      <style>{DatePickerStyle}</style>
    </div>
  );
}
