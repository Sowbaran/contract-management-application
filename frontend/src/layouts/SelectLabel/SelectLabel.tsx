import { Select } from "@ui-components";
import { FieldErrors } from "react-hook-form";
import { SelectLabelProps } from "./types";
import { cn } from "../../utils";
import { forwardRef } from "react";

// Define ref type to include focus method
export interface SelectLabelRef {
  focus: () => void;
}

export const SelectLabel = forwardRef<SelectLabelRef, SelectLabelProps>(
  (
    {
      formName = "",
      htmlFor,
      labelProps = {
        lblColor: "slate",
        lblSize: "sm",
      },
      lblText,
      formConfig,
      required = false,
      errorMessage = "",
      isDraftSubmitted = false,
      ...props
    },
    ref
  ) => {
    const { formState } = formConfig || {};
    const errors = formState?.errors as FieldErrors;
    const isSubmitted = formState?.isSubmitted || isDraftSubmitted;

    const errMessage =
      isSubmitted &&
      (errorMessage ||
        (formName && errors && formName in errors ? errors[formName]?.message : undefined));

    return (
      <div className={cn("flex flex-col", props.mainContainerStyle)}>
        <div className="flex flex-row items-center mb-2">
          <label htmlFor={htmlFor} className={cn(labelProps.className, "text-gray-900 text-md")}>
            {`${lblText} `}
            {required && <span className="text-red-600 ml-1 text-md">{"*"}</span>}
          </label>
        </div>
        <Select {...props} ref={ref} />
        {errMessage && typeof errMessage === "string" && (
          <p className="text-xs text-red-600">{errMessage}</p>
        )}
      </div>
    );
  }
);