import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { forwardRef, useEffect, useState } from "react";
import { cn } from "../../utils";
import type { AccordionContentProps, AccordionProps } from "./types";
import {
  AccordionActionStyle,
  AccordionContentStyle,
  AccordionHeaderStyle,
  AccordionMainContainerStyle,
} from "./styles";

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      onToggle,
      openId,
      selectedId,
      children,
      headerLabel,
      variant = "default",
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [animate, setAnimate] = useState(false);

    const handleOpen = () => {
      if (!open) {
        onToggle?.(openId || "");
      } else {
        setOpen(!open);
        setTimeout(() => {
          setAnimate(false);
        }, 100);
        onToggle?.("");
      }
    };
    useEffect(() => {
      if (openId === selectedId) {
        setOpen(true);
        setTimeout(() => {
          setAnimate(true);
        }, 100);
      }
    }, [selectedId, openId]);

    return (
      <div
        className={cn(AccordionMainContainerStyle({ variant }), props.mainContainer)}
        ref={ref}
      >
        <div className={cn(AccordionHeaderStyle({ variant }), props.headerStyle)}>
          <button
            type="button"
            className={cn(AccordionActionStyle({ variant }), props.headerBtnStyle)}
            onClick={handleOpen}
          >
            {headerLabel}
          </button>
          {open ? (
            <ChevronUpIcon onClick={handleOpen} className="w-4 h-4 cursor-pointer" />
          ) : (
            <ChevronDownIcon onClick={handleOpen} className="w-4 h-4 cursor-pointer" />
          )}
        </div>
        {open && (
          <div data-animate={animate} className="group">
            <AccordionContent
              className={cn(
                AccordionContentStyle({ variant }),
                "transition-opacity duration-500 ease-in-out overflow-hidden group-data-[animate=true]:opacity-100 group-data-[animate=false]:opacity-0",
                props.contentContainerStyle,
              )}
            >
              {children}
            </AccordionContent>
          </div>
        )}
      </div>
    );
  },
);

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, className }, ref) => {
    return (
      <div ref={ref} className={className}>
        {" "}
        {children}
      </div>
    );
  },
);
export { AccordionHeaderStyle };
