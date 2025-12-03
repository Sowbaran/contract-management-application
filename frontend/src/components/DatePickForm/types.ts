import { UseFormReturn } from "react-hook-form";
import { NewFormProps } from "../../constants/formConstants";

export type DatepickProps = {
  id : string
  name: string;
  labelList? : string[];
  required?: boolean;
  formConfig? : UseFormReturn<NewFormProps>;
  minDate?:string
};
