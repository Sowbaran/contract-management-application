import { VariantProps } from "class-variance-authority";
import React from "react";
import { MenuButtonVariants, MenuContainerVariants } from "./styles";
import { AnyProps } from "../utils/types";

export interface MenuUiProps extends CustomMenuStyles {
  buttonType?: "button" | "custom",
  options: MenuItemProps[];
  label?: string;
  onMenuChange: (id: string , data?:MenuItemProps) => void;
  customMenuButton? : React.ReactNode;
  enableIcons?: boolean;
  avatarSrc?: string;
  labelStyle?: string;
  buttonVariants?: VariantProps<typeof MenuButtonVariants>;
  containerVariants?: VariantProps<typeof MenuContainerVariants>;
  customLabel?: React.ReactNode;
  disabled?: boolean;
  enableSearch?: boolean;
  selectedId?:string
  requireMenuData?:boolean;
}

export interface MenuItemProps {
  id: string;
  label: string;
  data?:AnyProps;
  url?: string;
  content?: React.ReactNode;
}

export interface CustomMenuStyles {
  buttonClassName?: string;
  buttonContClassName?:string;
  itemClassName?: string;
  containerClassName?: string;
  mainContClassName? : string;
}
