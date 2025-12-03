import { LabelProps } from "@ui-components/Label/types";
import { AnyProp } from "../common/types";
export type LabelLayoutProps = {
    labelProps?:Omit< LabelProps , "text">,
    lblText : string,
    lblLink?: AnyProp,
}

export type FormValues = {
    [key in string] : AnyProp
 }