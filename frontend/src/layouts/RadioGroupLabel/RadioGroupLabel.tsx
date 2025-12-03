import { RadioGroup } from "@ui-components";
import { FieldErrors } from "react-hook-form";
import { RadioGroupLabelProps } from "./types";
import { cn } from "../../utils";
import { forwardRef } from "react";

// Define ref type for RadioGroupLabel
export interface RadioGroupLabelRef {
  focus: () => void;
}

export const RadioGroupLabel = forwardRef<RadioGroupLabelRef, RadioGroupLabelProps>(
  (
    {
      formName = "",
      htmlFor,
      labelProps = {
        lblColor: "slate",
        lblSize: "sm",
      },
      lblText,
      lblLink,
      formConfig,
      required = false,
      errorMessage = "",
      ...props
    },
    ref
  ) => {
    const { formState } = formConfig || {};
    const errors = formState?.errors as FieldErrors;
    const isSubmitted = formState?.isSubmitted;

    const errMessage =
      isSubmitted &&
      (errorMessage ||
        (formName && errors && formName in errors ? errors[formName]?.message : undefined));

    return (
      <div className={cn("flex flex-col", props.mainContainerStyle)}>
        <div className="flex flex-row items-center">
          <label htmlFor={htmlFor} className={cn(labelProps.className, "text-gray-900 text-md")}>
            {`${lblText} `} {lblLink}
            {required && <span className="text-red-600 text-md">{"*"}</span>}
          </label>
        </div>
        <div className={cn("flex items-center gap-3")}>
          <RadioGroup {...props} ref={ref} />
        </div>
        {errMessage && typeof errMessage === "string" && (
          <p className="text-xs text-red-600 mt-2">{errMessage}</p>
        )}
      </div>
    );
  }
);