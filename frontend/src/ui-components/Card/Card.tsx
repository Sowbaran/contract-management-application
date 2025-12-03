import type { CardProps } from "./types";
import { forwardRef } from "react";
import { cn } from "../../utils";
import { CardVariants } from "./styles";

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      headerContent,
      mainContent,
      footerContent,
      className,
      colorBg,
      colorBorder,
      headerMainContainerStyle,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col rounded-md shadow-md",
          CardVariants({ colorBg, colorBorder }),
          className
        )}
      >
        <div className={headerMainContainerStyle}>
          {headerContent}
          {mainContent}
        </div>
        {footerContent}
      </div>
    );
  }
);
