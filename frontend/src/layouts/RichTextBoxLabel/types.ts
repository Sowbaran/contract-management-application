import { UseFormReturn } from "react-hook-form";
import { FormValues, LabelLayoutProps } from "../types";
import { RichTextBoxProps } from "@ui-components/RichTextBox/types";

export interface RichTextBoxLabelProps
  extends RichTextBoxProps,
    LabelLayoutProps {
  formName?: string;
  htmlFor: string;
  mainContainerStyle?: string;
  formConfig?: UseFormReturn<FormValues>;
  required?: boolean;
  errorMessage?: string;
}
