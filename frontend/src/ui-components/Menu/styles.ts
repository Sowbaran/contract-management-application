import { cva } from "class-variance-authority";

export const MenuButtonVariants = cva(
  " inline-flex justify-between gap-x-2 rounded-md px-4 py-2 text-md shadow-sm border h-[38px] disabled:text-slate-300 disabled:hover:bg-white disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        light: "bg-white text-slate-700 hover:bg-gray-50 border-gray-300 ",
        dark: "bg-black text-white border-neutral-600",
      },
    },
    defaultVariants: {
      variant: "light",
    },
  },
);

export const MenuContainerVariants = cva(
  "absolute mt-2 right-0 z-10 min-w-[240px] rounded-md shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in",
  {
    variants: {
      variant: {
        light: "bg-white",
        dark: "bg-black border border-neutral-600",
      },
      align: {
        left: "right-0",
        right: "left-0",
      },
    },
    defaultVariants: {
      variant: "light",
    },
  },
);

export const MenuItemVariants = cva(
  "relative w-full text-left px-4 py-2 data-[focus]:bg-gray-100 data-[focus]:text-gray-900",
  {
    variants: {
      variant: {
        light: "bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-medium group-data-[selected=true]:bg-[#F9FAFB]",
        dark: "bg-black text-white hover:bg-gray-700 opacity-3 font-medium group-data-[selected=true]:bg-gray-700",
      },
    },
    defaultVariants: {
      variant: "light",
    },
  },
);
