import { UseFormReturn } from "react-hook-form";
import { FormValues, LabelLayoutProps } from "../types";
import { SelectProps } from "@ui-components/Select/types";
 
export interface SelectLabelProps extends SelectProps , LabelLayoutProps{
    formName?:string,
    htmlFor : string,
    mainContainerStyle?:string,
    formConfig?: UseFormReturn<FormValues>,
    required?:boolean,
    isDraftSubmitted?: boolean,
    errorMessage?:string
}

