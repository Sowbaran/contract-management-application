import React from "react";

export interface RadioGroupProps extends React.BaseHTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export interface RadioGroupItemProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  value: string;
  size?: "sm" | "md";
  description: string;
  name: string;
  labelStyle?: string;
  innerCheckedStyle?: string;
  outerCheckedStyle?: string;
  outerRingStyle?: string;
  checkedStyle?: string;
  radioContainerStyle?: string;
}

export interface RadioOption {
  value: string;
  label: string;
  disabled: boolean;
  description: string;
}
