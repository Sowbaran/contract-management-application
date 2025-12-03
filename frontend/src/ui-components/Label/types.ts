import { VariantProps } from "class-variance-authority";
import { LabelHTMLAttributes } from "react";
import { LabelVariants } from "./styles";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> , VariantProps<typeof LabelVariants> {
  text? : string;
  iconRight? : React.ReactNode;
}

// export interface CustomLabelStyles {
//   labelStyle : string,
// }