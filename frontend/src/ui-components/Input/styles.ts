import { cva } from "class-variance-authority";

export const InputVariants = cva(
  "h-9 w-full rounded-md bg-white px-4 text-base leading-6 font-regular",
  {
    variants: {
      variant: {
        default: [
          "border border-slate-300 text-gray-900 placeholder-slate-300",
          "outline-none focus:border-primary-300 focus:ring-4 ring-primary-100",
          "disabled:text-slate-500 disabled:border-0 disabled:bg-slate-100",
        ],
        error: [
          "border border-error-300 text-gray-900 placeholder-slate-300",
          "outline-none focus:border-error-300 focus:ring-4 ring-error-300/20",
        ],
      },
      inputPad: {
        leftSm: "pl-10",
        rightSm: "pl-10",
        bothSm: "px-10",
        left: "pl-12",
        right: "pr-12",
        both: "px-12",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        inputPad: "both",
      },
      {
        variant: "default",
        inputPad: "left",
      },
      {
        variant: "default",
        inputPad: "right",
      },
    ],
  },
);

export const InputContainerVariants = cva("relative box-border w-full", {
  variants: {
    outerMargin: {
      es: "mx-2 my-1",
      sm: "mx-2 my-2",
      md: "mx-3 my-2",
    },

    padding: {
      es: "px-2 py-1",
      sm: "px-2 py-2",
      md: "px-3 py-2",
    },
  },
});

// export const LeftIconVariants = cva("relative inline-block w-full" , {
//   variants :{
//     outerMargin : {
//       es : "mx-2 my-1",
//       sm : "mx-2 my-2",
//       md : "mx-3 my-2",
//     },

//     padding : {
//       es : "px-2 py-1",
//       sm : "px-2 py-2",
//       md : "px-3 py-2",
//     }
//   }
// })
