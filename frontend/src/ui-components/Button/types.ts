import { VariantProps } from "class-variance-authority";
import { ButtonVariants } from "./styles";

import { ButtonProps as HeadlessButtonProps } from "@headlessui/react";
import React from "react";

export interface ButtonProps
  extends VariantProps<typeof ButtonVariants>, 
    HeadlessButtonProps , CustomButtonStyles {
  id?:string;
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  buttonType?: "normal" | "icon";
}

export interface CustomButtonStyles {
  buttonStyle? : string,
  leftIconStyle? : string,
  rightIconStyle? : string,
} 