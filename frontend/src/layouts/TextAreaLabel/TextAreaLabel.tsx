import { TextArea } from "@ui-components";
import { FieldErrors } from "react-hook-form";
import { TextAreaLabelProps } from "./types";
import { cn } from "../../utils";

export const TextAreaLabel = ({
  formName = "",
  htmlFor,
  labelProps = {
    lblColor: "slate",
    lblSize: "sm",
    // fontWeight: "light"
  },
  lblText,
  formConfig,
  required = false,
  errorMessage="",
  mainContainerStyle,
  ...props
}: TextAreaLabelProps) => {
  const { register, formState } = formConfig || {};
  const errors = formState?.errors as FieldErrors;

  const errMessage =
    formName && errors && formName in errors ? errors[formName]?.message : undefined;


  return (
    <div className= {cn( "flex flex-col" , mainContainerStyle)}>
      <div className="flex flex-row items-center mb-2">
        <label htmlFor={htmlFor} className={cn(labelProps.className, "text-gray-900 text-md")}>
          {`${lblText} `}
          {required && <span className="text-red-600 ml-1 text-md">{"*"}</span>}
        </label>
      </div>
      <TextArea
        {...props}
        {...register?.(formName,required ? validationPatterns(formName, errorMessage) : undefined)}
      />
      {errMessage && typeof errMessage === "string" && <p className="text-xs text-red-600">{errMessage}</p>}
    </div>
  );
};

const validationPatterns = (ipType: string, errorMsg: string) => {
  switch (ipType) {
    default:
      return {
        required: errorMsg || "field required"
      };
  }
};