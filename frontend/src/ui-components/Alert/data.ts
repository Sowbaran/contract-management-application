import { ButtonProps } from "../Button/types";

export const errorBtnActions: ButtonProps[] = [
  {
    id:"redirect",
    variant: "green",
    size: "sm",
    label: "Redirect",
    buttonStyle: "w-full",
  },
  {
    id:"cancel",
    variant: "error",
    size: "sm",
    label: "Cancel",
    buttonStyle: "w-full",
  },
];
