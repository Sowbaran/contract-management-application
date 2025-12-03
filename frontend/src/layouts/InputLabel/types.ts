import { UseFormReturn } from "react-hook-form";
import { InputProps } from "@ui-components/Input/types";
import { FormValues, LabelLayoutProps } from "../types";


export interface InputLabelProps extends InputProps , LabelLayoutProps{
    formName?:string,
    htmlFor : string,
    mainContainerStyle?:string,
    formConfig?: UseFormReturn<FormValues>,
    required?:boolean,
    errorMessage?:string
}

