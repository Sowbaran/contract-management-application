import { UseFormReturn } from "react-hook-form";
import { FormValues, LabelLayoutProps } from "../types";
import { DatepickProps } from "../../components/DatePickForm/types";

export interface DateLabelProps
  extends Omit<DatepickProps, "id" | "name">,
    LabelLayoutProps {
  formName?: string;
  htmlFor: string;
  mainContainerStyle?: string;
  formConfig?: UseFormReturn<FormValues>;
  required?: boolean;
  errorMessage?: string;
  selectedDate?: Date | undefined;
}
