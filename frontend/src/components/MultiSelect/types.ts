import { UseFormReturn } from "react-hook-form";
import { NewFormProps } from "../../constants/formConstants";

export type MultiSelectProps = {
  id:string,
  name: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  onChange?: (value: string) => void;
  formConfig?:UseFormReturn<NewFormProps>,
  disable?: boolean;
  multiSelect?: boolean;
  defaultValues?: Option[];
};

export interface Option {
  label: string;
  value: number | string;
}
