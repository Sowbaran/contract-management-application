import { forwardRef } from "react";

import { CheckboxProps } from "./types";

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, enableLabel = true, ...props }, ref) => {
    return (
      <div className="inline-flex justify-center items-center">
        <label
          htmlFor="customCheckBox"
          className="relative flex items-center cursor-pointer"
        >
          <input
            id="customCheckBox"
            ref={ref}
            type="checkbox"
            className="peer appearance-none h-4 w-4 transition-all bg-white border-[1.5px] border-slate-300 rounded overflow-hidden checked:border-primary-600 checked:bg-primary-50"
            onChange={() => {}}
            {...props}
          />
          <span className="absolute text-primary-600 inset-0 top-[1px] left-[1px] transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
              stroke="currentColor"
              stroke-width=".4"
            >
              <title>Checkmark icon</title>
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
        </label>
        {enableLabel && (
          <label
            htmlFor="customCheckBox"
            className="ml-2 min-w-0 flex-1 font-medium text-md text-gray-900"
          >
            {label}
          </label>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "CheckBox";
