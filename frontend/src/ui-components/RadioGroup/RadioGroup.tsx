import * as React from "react";
import { cn } from "../../utils";
import { RadioGroupItemProps, RadioGroupProps } from "./types";
import { forwardRef, useImperativeHandle, useRef } from "react";

export interface RadioGroupItemRef {
  focus: () => void;
}

export const RadioGroupItem = forwardRef<RadioGroupItemRef, RadioGroupItemProps>(
  (
    {
      className,
      disabled,
      checked,
      value,
      name,
      size,
      children,
      description,
      onChange,
      outerRingStyle,
      outerCheckedStyle,
      innerCheckedStyle,
      radioContainerStyle,
      labelStyle,
      checkedStyle,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // Expose focus method via ref
    useImperativeHandle(ref, () => ({
      focus: () => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      },
    }));

    const outerRingSize = size === "md" ? "h-5 w-5" : "h-4 w-4";
    const innerRingSize = size === "md" ? "h-2 w-2 m-1.5" : "h-1.5 w-1.5 m-[5px]";
    const fontSize =
      size === "md" ? "text-base font-medium ml-3" : "text-sm font-medium ml-2";

    return (
      <label className={cn("flex", radioContainerStyle)}>
        <input
          type="radio"
          name={name}
          className={cn("sr-only peer", className)}
          value={value}
          onChange={onChange}
          ref={inputRef}
          disabled={disabled}
          {...props}
        />
        <div
          className={cn(
            `${outerRingSize} rounded-full bg-slate-100 shadow relative peer-focus:ring-4 peer-focus:ring-primary-100 m-0.5`,
            outerCheckedStyle
          )}
        >
          <div
            className={`${innerRingSize} rounded-full absolute ${checked ? innerCheckedStyle || "bg-primary-600" : "bg-transparent"} ${disabled && "bg-slate-200"} `}
          />
          <div
            className={cn(
              `absolute inset-0 rounded-full border ${disabled && "border-slate-200"} hover:border-primary-600 ${checked ? outerCheckedStyle || "border-primary-600" : "border-slate-200"} `,
              outerRingStyle
            )}
          />
        </div>
        {children && (
          <span
            className={`${fontSize} ${disabled ? "text-slate-200" : "text-slate-700"}`}
          >
            {children}
          </span>
        )}
      </label>
    );
  }
);

export const RadioGroup = forwardRef<RadioGroupItemRef, RadioGroupProps>(
  (
    {
      className,
      children,
      orientation = "horizontal",
      ...props
    },
    ref
  ) => {
    const directionClass =
      orientation === "horizontal" ? "flex gap-4" : "flex flex-col gap-4";

    // Forward ref to the first RadioGroupItem
    const childRefs = React.Children.map(children, () => useRef<RadioGroupItemRef>(null));

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (childRefs && childRefs[0]?.current) {
          childRefs[0].current.focus();
        }
      },
    }));

    return (
      <div className={cn(directionClass)} {...props}>
        {React.Children.map(children, (child, index) =>
          React.isValidElement(child)
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            ? React.cloneElement(child as React.ReactElement<any>, {
              ref: childRefs?.[index],
            })
            : child
        )}

      </div>
    );
  }
);