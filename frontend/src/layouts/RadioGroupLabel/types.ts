import { UseFormReturn } from "react-hook-form";
import { RadioGroupProps } from "@ui-components/RadioGroup/types";
import { FormValues, LabelLayoutProps } from "../types";

export interface RadioGroupLabelProps extends RadioGroupProps, LabelLayoutProps {
  formName?: string;
  htmlFor: string;
  mainContainerStyle?: string;
  formConfig?: UseFormReturn<FormValues>;
  required?: boolean;
  errorMessage?: string;
}
