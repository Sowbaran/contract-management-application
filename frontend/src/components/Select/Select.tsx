import type { SelectProps } from "./types";
// import { useSelectStore } from "../../store";

export function Select(props: SelectProps) {
  const { register, formState } = props.formConfig || {};
  const { errors } = formState || {};
  const errorMessage = errors ? errors[props.id || ""]?.message : "";

  return (
    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-4 sm:text-sm pb-4">
      <label className="text-gray-900 block text-sm font-medium leading-6 sm:pt-1.5">
        {props.name}
        {props.required && <span style={{ color: "red" }}>*</span>}
      </label>
      <div className="max-w-[450px] mt-2 sm:col-span-2 sm:mt-0">
        <select
          {...register?.(props.id, { required: "Select a valid option" })}
          id={props.id}
          className="ps-1 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:leading-6 disabled:ring-gray-500 disabled:bg-gray-200 disabled:text-gray-500"
          disabled={props.disable}
        >
          {props.placeholder && (
            <option className="ps-1" value="" disabled selected>
              {props.placeholder}
            </option>
          )}
          {props.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
          {typeof errorMessage === "string" && (
            <p className="block text-red-400 m-1 text-sm">{errorMessage}</p>
          )}
      </div>
    </div>
  );
}
