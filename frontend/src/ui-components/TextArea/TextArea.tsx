import * as React from "react";

import { cn } from "../../utils";
import { TextareaProps } from "./types";

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ additionalStyles , ...props }, ref) => {
    const defaultTextAreaStyle = 
      "flex w-full pt-[5px] min-h-[36px] placeholder-slate-300 rounded-md border border-slate-300 bg-white px-4 text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-100 focus-visible:border-primary-300 disabled:cursor-not-allowed disabled:opacity-50"
    return (
      <div className={cn("flex-wrap",additionalStyles?.containerStyle)}>
      <textarea style={{resize:"vertical" }} className={cn(defaultTextAreaStyle ,   additionalStyles?.textareaStyle)} ref={ref} {...props} />
    </div>
    );
  },
);
