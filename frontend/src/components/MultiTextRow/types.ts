import { UseFormReturn } from "react-hook-form";
import { NewFormProps } from "../../constants/formConstants";

export type MultiTextRowProps = {
  id : string;
  name: string;
  required?: boolean;
  placeHolder?:string
  rows?: number;
  formConfig? : UseFormReturn<NewFormProps>
};
