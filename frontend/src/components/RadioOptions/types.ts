import { UseFormReturn } from "react-hook-form";
import { NewFormProps } from "../../constants/formConstants";

export type RadioOptionsProps = {
  // prop?: string
  id:string
  name: string;
  options: {id:string , text: string }[];
  required?: boolean;
  formConfig? : UseFormReturn<NewFormProps>
  disable?:boolean
};
