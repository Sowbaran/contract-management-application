import { Input } from "@ui-components";
import { FieldErrors } from "react-hook-form";
import { InputLabelProps } from "./types";
import { cn } from "../../utils";

export const InputLabel = ({
  formName = "",
  htmlFor,
  labelProps = {
    lblColor: "slate",
    lblSize: "sm"
    // fontWeight: "light"
  },
  lblText,
  formConfig,
  variant = "default",
  required = false,
  errorMessage = "",
  ...props
}: InputLabelProps) => {
  const { register, formState } = formConfig || {};
  const errors = formState?.errors as FieldErrors;

  const errMessage =
    formName && errors && formName in errors ? errors[formName]?.message : undefined;

  return (
    <div className={cn("flex flex-col", props.mainContainerStyle)}>
      <div className="flex flex-row items-center mb-2">
        <label htmlFor={htmlFor} className={cn(labelProps.className, "text-gray-900 text-md")}>
          {`${lblText} `}
          {required && <span className="text-red-600 ml-1 text-md">{"*"}</span>}
        </label>
      </div>

      <Input
        //variant={ !errMessage? variant : "error"}
        variant={variant}
        {...props}
        {...register?.(
          formName,
          required ? validationPatterns(formName, errorMessage) : undefined
        )}
        onKeyPress={e => {
          if (formName === "monetary_value" || formName === "monetary_value_currency") {
            const charCode = e.which || e.keyCode;
            const charStr = String.fromCharCode(charCode);

            // Allow only numbers and a single dot (.)
            if (!/^-?\d*$/.test(charStr)) {
              e.preventDefault();
            }
          }
          if (formName === "other_currency") {
            const charCode = e.which || e.keyCode;
            const charStr = String.fromCharCode(charCode);
            // Allow only letters (a-z and A-Z)
            if (!/^[a-zA-Z]$/.test(charStr)) {
              e.preventDefault();
            }
          }
        }}
        onPaste={e => {
          if (formName === "monetary_value" || formName === "monetary_value_currency") {
            const pastedText = e.clipboardData.getData("text");

            // Prevent pasting non-numeric values
            if (!/^-?\d*\.?\d*$/.test(pastedText)) {
              e.preventDefault();
            }
          }
        }}
        onKeyUp={e => {
          if (formName === "monetary_value" || formName === "monetary_value_currency") {
            const input = e.currentTarget as HTMLInputElement;
            let value = input.value;

            // Remove commas for clean processing
            value = value.replace(/,/g, "");

            // Allow only digits and one optional dot
            value = value.replace(/[^0-9.]/g, "");

            const [intPart, decimalPart] = value.split(".");
            const formattedInt = intPart
              ? parseInt(intPart, 10).toLocaleString("en-AU")
              : "";

            const formattedValue =
              decimalPart !== undefined ? `${formattedInt}.${decimalPart}` : formattedInt;

            // Set the formatted value back to the input
            input.value = formattedValue;

            // Trigger the onChange event, if any
            if (props.onChange) {
              props.onChange({
                ...e,
                target: input // Use the correctly typed HTMLInputElement
              });
            }
          }
        }}
      />
      {errMessage && typeof errMessage === "string" && (
        <p className="text-xs text-red-600">{errMessage}</p>
      )}
    </div>
  );
};

const validationPatterns = (ipType: string, errorMsg: string) => {
  switch (ipType) {
    case "requester_email":
    case "role_reporting_email":
      return {
        required: errorMsg || "Field is required",
        pattern: {
          value:
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          message: errorMsg || "please enter a valid email"
        }
      };
    default:
      return {
        required: "Field is required"
      };
  }
};
