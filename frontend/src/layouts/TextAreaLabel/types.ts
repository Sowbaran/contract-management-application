import { UseFormReturn } from "react-hook-form";
import { FormValues, LabelLayoutProps } from "../types";
import { TextareaProps } from "@ui-components/TextArea/types";


export interface TextAreaLabelProps extends TextareaProps , LabelLayoutProps{
    formName?:string,
    htmlFor : string,
    mainContainerStyle?:string,
    formConfig?: UseFormReturn<FormValues>,
    required?:boolean,
    errorMessage?:string
}

