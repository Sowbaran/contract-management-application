import { cva } from "class-variance-authority";

export const AccordionMainContainerStyle = cva("", {
    variants: {
      variant: {
        default: "",
        integrity: "bg-[#CCE0FF] border-l-4 border-l-[#0062FF] rounded-md",
      },
    },
  });

export const AccordionHeaderStyle = cva("", {
  variants: {
    variant: {
      default: "rounded-t-md bg-[#CCE0FF] px-4 flex justify-between items-center",
      integrity: "px-4 flex justify-between items-center",
    },
  },
});

export const AccordionActionStyle = cva("", {
  variants: {
    variant: {
      default: "h-10 flex-1 text-left font-medium",
      integrity: "h-10 flex-1 text-left font-medium text-[15px]",
    },
  },
});

export const AccordionContentStyle = cva("", {
  variants: {
    variant: {
      default: "px-4 pb-2",
      integrity: "px-4 pb-2",
    },
  },
});
