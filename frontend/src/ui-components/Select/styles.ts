import { cva } from "class-variance-authority";

export const ListboxContainerVariants = cva("relative w-full font-semibold", {
  variants: {
    size: {
      sm: "h-8 text-sm",
      md: "h-11 text-md",
    },
  },
  defaultVariants:{
    size:"md"
  }
});

export const ListboxButtonVariants = cva(
  "w-full h-full cursor-default rounded-md bg-white py-1.5 pl-0 pr-10 text-left shadow-sm border focus:outline-none font-medium sm:text-md sm:leading-6 disabled:border-0 disabled:bg-slate-100 disabled:text-gray-600",
  {
    variants: {
      size: {
        sm: "py-0",
        md: "py-1.5",
      },
    },
  },
);

export const ListboxOptionsVariants = cva(
  "z-10 absolute font-semibold mt-3 w-full max-h-[200px] scrollbar-thin scrollbar-webkit text-md rounded-md overflow-auto custom-scrollbar bg-white px-1 py-1 text-base shadow-lg ring-1 ring-inset ring-gray-800 ring-opacity-5 focus:outline-none",
  {
    variants: {
      size: {
        sm: "mt-2",
        md: "mt-3",
      },
      enableSearch: {
        true: "min-h-[280px]",
      },
    },
  },
);

export const ListboxItemVariants = cva(
  "group relative cursor-default font-normal select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-gray-100 data-[focus]:text-gray-700",
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "text-md",
      },
    },
  },
);
