import { RichTextBox } from "@ui-components";
import { FieldErrors } from "react-hook-form";
import { cn } from "../../utils";
import { RichTextBoxLabelProps } from "./types";
import "./RichTextBoxLabel.css";
import { forwardRef } from "react";

// Define ref type to include focus method
export interface RichTextBoxLabelRef {
  focus: () => void;
}

export const RichTextBoxLabel = forwardRef<RichTextBoxLabelRef, RichTextBoxLabelProps>(
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
        <div className="flex flex-row items-center mb-2">
          <label htmlFor={htmlFor} className={cn(labelProps.className, "text-gray-900 text-md")}>
            {`${lblText} `}
            {required && <span className="text-red-600 ml-1 text-md">{"*"}</span>}
          </label>
        </div>
        <div>
          <RichTextBox {...props} ref={ref} />
        </div>
        {errMessage && typeof errMessage === "string" && (
          <p className="text-xs text-red-600 mt-2">{errMessage}</p>
        )}
      </div>
    );
  }
);