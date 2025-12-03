import { VariantProps } from "class-variance-authority";
import React from "react";
import { InputContainerVariants, InputVariants } from "./styles";

// export interface IconProps {
//   element: React.ReactNode;
// }

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof InputVariants>,
    CustomInputStyles {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  containerVar?: VariantProps<typeof InputContainerVariants>;
}

export interface CustomInputStyles {
  containerStyle?: string;
  inputStyle?: string;
  leftIconStyle?: string;
  rightIconStyle?: string;
}
