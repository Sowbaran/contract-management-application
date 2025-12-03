// import { useState } from "react";
import type { DatepickProps } from "./types";
import DatePicker from "react-datepicker";
import { Controller } from "react-hook-form";

export function DatePickForm(props: DatepickProps) {
  const{control} = props.formConfig || {}

  return (
    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-4">
      <div
        className="text-sm font-medium leading-6 text-gray-900"
        aria-hidden="true"
      >
        {props.name}
        {props.required && <span style={{ color: "red" }}>*</span>}
        <br/>
        {
          props.labelList?.map((str, index) =>(
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <p key={index}>{str}</p>
          ))
        }
      </div>
      <Controller
          name={props.id} 
          control={control} 
          defaultValue={new Date().toISOString()} 
          render={({ field }) => (
            <DatePicker
              id={props.id}
              selected={field.value ? new Date(field.value) : null}
              onChange={(date) => {
                field.onChange(date);
                // setStartDate(date); // Update the local component state if needed
              }}         
              className="ring-1 ring-inset ring-gray-300 rounded-md text-gray-900"
              showIcon
              minDate={new Date(props.minDate !== undefined ? props.minDate : "")}
            />
          )}
        />
      {/* <DatePicker
        id={props.id}
        
        className="ring-1 ring-inset ring-gray-300 rounded-md text-gray-900"
        showIcon
        selected={startDate}
        onChange={(date: Date) => setStartDate(date)}
      /> */}
    </div>
  );
}
