import { SwitchProps } from "@ui-components/Switch/types";
import { FormValues, LabelLayoutProps } from "../types";
import { UseFormReturn } from "react-hook-form";

export interface SwitchLabelProps extends SwitchProps, LabelLayoutProps {
  mainContainerStyle?: string;
  required?: boolean;
  formName?: string;
  formConfig?: UseFormReturn<FormValues>;
  switchLabel?: string;
  switchContainerStyle?: string;
  switchLabelStyle?: string;
  errorMessage?: string;
}
