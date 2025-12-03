import { forwardRef } from "react";
import { cn } from "../../utils";
import { InputContainerVariants, InputVariants } from "./styles";
import { InputProps } from "./types";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { variant, inputPad, iconLeft, iconRight, containerVar, className, ...props },
    ref,
  ) => {
    const containerClsx = cn(InputContainerVariants(containerVar), props.containerStyle);
    const leftIconClsx = cn(
      "absolute inset-y-0 left-4 flex items-center",
      props.leftIconStyle,
    );
    const rightIconClsx = cn(
      "absolute inset-y-0 right-4 flex items-center",
      props.rightIconStyle,
    );

    const clsxMerge = cn([InputVariants({ variant, inputPad })], ` ${className}`);

    return (
      <div className={containerClsx}>
        <div className="relative">
          {iconLeft && <span className={leftIconClsx}>{iconLeft}</span>}
          {iconRight && <span className={rightIconClsx}>{iconRight}</span>}
          <input ref={ref} className={clsxMerge} {...props} />
        </div>
      </div>
    );
  },
);
