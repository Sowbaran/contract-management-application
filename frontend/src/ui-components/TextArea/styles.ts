import { cva } from "class-variance-authority";

export const TextAreaVariants = cva(
  "h-10 w-full rounded-md bg-white px-4 py-3 text-base leading-6",
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
    },
  },
);
