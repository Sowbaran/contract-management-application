import { cva } from "class-variance-authority";

export const BadgeVariants = cva(
  "inline-flex justify-center px-2 py-[2px] font-medium text-[12px]",
  {
    variants: {
      variant: {
        error: "text-error-500 bg-error-50",
        success: "text-success-700 bg-success-50",
        red: "text-red-700 bg-red-50",
        blue: "text-blue-700 bg-blue-50",
        green: "text-green-700 bg-green-50",
        yellow: "text-yellow-500 bg-yellow-100",
        indigo: "text-indigo-700 bg-indigo-50",
        purple: "text-purple-700 bg-purple-50",
        pink: "text-pink-700 bg-pink-100",
        gray: "text-gray-700 bg-gray-100",
        lime: "text-lime-700 bg-lime-100",
        amber: "text-amber-700 bg-amber-100",
        teal: "text-teal-700 bg-teal-100",

        orange: "text-orange-700 bg-orange-50",
        cyan: "text-cyan-700 bg-cyan-50",
        violet: "text-violet-700 bg-violet-100",

        fuchsia: "bg-fuchsia-100 text-fuchsia-700 ring-red-700/10",
        rose: "bg-rose-100 text-rose-700 ring-red-700/10",

        red2: "bg-red-100 text-red-700 ring-red-700/10",
        blue2: "bg-blue-100 text-blue-700 ring-blue-700/10",
        green2: "bg-green-100 text-green-700 ring-green-700/10",
        yellow2: "bg-yellow-100 text-yellow-700 ring-yellow-700/10",
        indigo2: "bg-indigo-100 text-indigo-700 ring-indigo-700/10",
        purple2: "bg-purple-100 text-purple-700 ring-purple-700/10",
        pink2: "bg-pink-100 text-pink-700 ring-pink-700/10",
        gray2: "bg-gray-100 text-gray-700 ring-gray-700/10",
        lime2: "bg-lime-100 text-lime-700 ring-lime-700/10",
        amber2: "bg-amber-100 text-amber-700 ring-amber-700/10",
        teal2: "bg-teal-100 text-teal-700 ring-teal-700/10",
      },
      rounded: {
        full: "rounded-full",
        sm: "rounded-sm",
      },
    },
  },
);
