import { forwardRef } from "react";

import { CheckboxGroupProps } from "./types";

export const CheckboxGroup = forwardRef<HTMLInputElement, CheckboxGroupProps>(
  ({ label, className, disabled, description, size, ...props }, ref) => {

    const fontSize = size === "md" ? "text-base font-medium" : "text-sm font-medium";
    const divSize = size === "md"
      ? "w-36 h-6 inline-flex items-start"
      : "w-36 h-5 inline-flex items-start";
    const desDivSize = size === "md"
      ? "w-80 h-12 inline-flex items-start"
      : "w-80 h-10 inline-flex items-start";

    return (
      <div className={`${description ? desDivSize : divSize}`} >
        <div className={`gap-2 inline-flex`}>
          <label
            htmlFor="customCheckBox"
            className="relative flex m-0.5"
          >
            <input
              ref={ref}
              type="checkbox"
              className={`${size === 'md' ? 'w-5 h-5' : 'w-4 h-4'} ${disabled ? "checked:border-slate-300 bg-slate-100 pointer-events-none" : "hover:border-primary-600 checked:border-primary-600 checked:shadow-[0px_0px_0px_4px_rgba(221,234,252,1.00)] bg-white pointer-events-auto"} peer appearance-none transition-all border-[1.5px] border-slate-300 rounded overflow-hidden`}
              onChange={() => { }}
              {...props}
            />
            <span className={`absolute ${disabled ? "text-slate-300" : "text-primary-600"} ${size === 'md' ? 'w-4 h-4' : 'w-3 h-3'} top-0.5 left-0.5 inset-0 transition-opacity opacity-0 pointer-events-none rounded peer-checked:opacity-100`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={``}
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
          <label
            htmlFor="customCheckBox"
            className={`relative flex ${fontSize} ${disabled ? "text-slate-200" : "text-slate-700"}`}
          >
            {label}
            <br />
            {description}
          </label>
        </div>
      </div>
    );
  },
);