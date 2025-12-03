import { Switch } from "@ui-components";
import { SwitchLabelProps } from "./types";
import { cn } from "../../utils";
import { FieldErrors } from "react-hook-form";

export const SwitchLabel = ({
  id,
  formName = "",
  lblText,
  active = false,
  labelProps = {
    lblColor: "slate",
    lblSize: "sm",
    fontWeight: "light"
  },
  formConfig,
  switchLabel = "",
  required = false,
  errorMessage = "",
  onChange,
  ...props
}: SwitchLabelProps) => {
  const { formState } = formConfig || {};
  const errors = formState?.errors as FieldErrors;
  const isSubmitted = formState?.isSubmitted; // Tracks if form is submitted

  const errMessage =
    isSubmitted &&
    (errorMessage ||
      (formName && errors && formName in errors ? errors[formName]?.message : undefined));

  return (
    <div>
      <div className={cn("flex flex-row justify-between", props.mainContainerStyle)}>
        <label htmlFor={htmlFor} className={cn(labelProps.className, "text-gray-900 text-md")}>
          {`${lblText} `}
          {required && <span className="text-red-600 ml-1 text-md">{"*"}</span>}
        </label>
        <div className={cn("flex items-center gap-3", props.switchContainerStyle)}>
          <Switch id={id} active={active} onChange={onChange} />
          <span className={cn("font-light text-gray-500", props.switchLabelStyle)}>
            {switchLabel}
          </span>
        </div>
      </div>
      <div>
        {errMessage && typeof errMessage === "string" && (
          <p className="text-xs text-red-600">{errMessage}</p>
        )}
      </div>
    </div>
  );
};
