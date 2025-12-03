import { UseFormReturn } from "react-hook-form";
import { NewFormProps } from "../../constants/formConstants";

export type SelectProps = {
  id:string,
  name: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  onChange?: (value: string) => void;
  formConfig?:UseFormReturn<NewFormProps>,
  disable?: boolean;
};

interface Option {
  label: string;
  value: number | string;
}
