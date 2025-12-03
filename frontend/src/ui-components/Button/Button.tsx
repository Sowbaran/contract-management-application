import { Button as HeadlessButton } from "@headlessui/react";
import { forwardRef } from "react";
import { cn } from "../../utils";
import { ButtonVariants } from "./styles";
import type { ButtonProps } from "./types";

export const Button = forwardRef<HTMLElement, ButtonProps>(
  (
    {
      variant,
      size,
      label,
      fullWidth,
      leftIcon,
      rightIcon,
      className,
      buttonType = "normal",
      iconSize,
      buttonStyle,
      leftIconStyle,
      rightIconStyle,
      ...props
    },
    ref,
  ) => {
    const defStyle = cn(
      ButtonVariants({ variant, size, fullWidth, iconSize }),
      className,
    );

    return (
      <>
        {buttonType === "icon" ? (
          <HeadlessButton ref={ref} className={cn(defStyle , buttonStyle)} {...props}>
            {leftIcon && <span>{leftIcon}</span>}
          </HeadlessButton>
        ) : (
          <HeadlessButton ref={ref} className={cn(defStyle , buttonStyle)} {...props}>
            {leftIcon && (
              <span className={cn(ButtonVariants({ iconLeftLblSpacing: size }),leftIconStyle)}>
                {leftIcon}
              </span>
            )}
            {label}
            {rightIcon && (
              <span className={cn(ButtonVariants({ iconRightLblSpacing: size }), rightIconStyle)}>
                {rightIcon}
              </span>
            )}
          </HeadlessButton>
        )}
      </>
    );
  },
);

export function TouchTarget({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span
        className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
        aria-hidden="true"
      />
      {children}
    </>
  );
}
