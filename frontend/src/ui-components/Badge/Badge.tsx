import { forwardRef } from "react";
import { cn } from "../../utils";
import { BadgeVariants } from "./styles";
import { BadgeProps } from "./types";

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, icon, variant = "gray", rounded = "full", label,labelClassName ,...props }, ref) => {
    {
      const clsxMerge = cn( BadgeVariants({ variant, rounded }), className);
      return (
        <div ref={ref} className={clsxMerge} {...props}>
          {icon && icon }
          <div className={cn("font-semibold", labelClassName)}>{label}</div>
        </div>
      );
    }
  },
);
