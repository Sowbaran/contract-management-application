import { cva } from "class-variance-authority";

export const ButtonVariants = cva(
  "inline-flex justify-center items-center rounded font-medium",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-600 text-white border border-primary-600 hover:bg-primary-700 disabled:bg-gray-200 disabled:text-neutral-400 disabled:border-none",
        outline:
          "bg-white text-primary-600 border border-primary-600 hover:bg-primary-100 disabled:bg-gray-100 disabled:border-neutral-400 disabled:text-gray-400 ",
        plain:
          "bg-white text-primary-600 hover:bg-primary-100 disabled:bg-white disabled:text-neutral-400",
        gray: "bg-white text-gray-700 border border-slate-300 hover:bg-slate-100 disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400",
        error:
          "bg-red-600 text-white border border-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-neutral-400 disabled:border-none",
        green:
          "bg-green-600 text-white font-medium hover:bg-gray-500 hover:border-gray-500 disabled:text-neutral-400 disabled:border-none disabled:bg-gray-100 disabled:hover:none",
        greenOutline:
          "border-2 border-green-600 text-green-600 font-medium hover:bg-green-600 hover:text-white disabled:text-neutral-400 disabled:border-none disabled:bg-gray-100 disabled:hover:none",
      },
      size: {
        sm: "text-sm py-2 px-3 leading-5 h-9",
        md: "text-sm py-2 px-4 leading-5 h-10",
        lg: "text-base  px-4 py-2 leading-6 h-11",
        xl: "text-base py-3 px-5 leading-6 h-12 ",
        xxl: "text-base py-4 px-7 leading-7 h-15",
      },

      iconSize: {
        sm: "p-2",
        md: "p-[10px]",
        lg: "p-3",
        xl: "p-[14px]",
      },

      iconLeftLblSpacing: {
        sm: "me-1.5",
        md: "-ms-1 me-1.5",
        lg: "-ms-1 me-1.5",
        xl: "-ms-1 me-1.5",
        xxl: "-ms-2 me-2",
      },

      iconRightLblSpacing: {
        sm: "ms-1.5",
        md: "ms-2",
        lg: "ms-2",
        xl: "ms-3",
        xxl: "ms-3",
      },

      fullWidth: {
        true: "w-full",
      },
    },
    compoundVariants: [
      {
        variant: "primary",
        size: "md",
      },
      {
        variant: "outline",
        size: "md",
      },
      {
        variant: "plain",
        size: "md",
      },
    ],
  },
);
