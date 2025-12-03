import { cva } from "class-variance-authority";

export const LabelVariants = cva("",{
  variants: {
    lblColor: {
      default: "text-black",
      slate: "text-slate-500",
      primary: "text-primary-600",
      white : "text-white",

    },
    lblSize: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-md",
    },
    fontWeight:{
      light: "font-light",
      normal:"font-regular",
      medium:"font-medium",
      large:"font-large",
    }
  },
  defaultVariants: {
    lblSize:"sm",
    lblColor: "default",
    fontWeight:"normal",
  },
});
