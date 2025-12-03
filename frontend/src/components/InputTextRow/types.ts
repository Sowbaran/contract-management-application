import { UseFormReturn } from "react-hook-form";
import { NewFormProps } from "../../constants/formConstants";
export type FormValues = {
  [key: string]: string;
};
export type InputTextRowProps = {
  name: string;
  labelList? : string[];
  placeHolder?: string;
  required?: boolean;
  type?: string;
  id?: string;
  formConfig?: UseFormReturn<NewFormProps>;
  value?: string;
  disable?: boolean;
  min?:number;
  max?:number;
};
