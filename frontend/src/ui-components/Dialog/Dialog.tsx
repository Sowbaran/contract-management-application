import {
  Button,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Dialog as HeadlessDialog,
} from "@headlessui/react";
import { cva } from "class-variance-authority";
import { forwardRef, useState } from "react";
import { cn } from "../../utils";
import { DialogProps } from "./types";

export const panelVariant = cva(
  "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95",
);
export const titleVariant = cva("text-xl text-gray-500");
export const contentVariant = cva("text-sm text-gray-500");

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ title, content, buttonActions, icon }, ref) => {
    {
      const [open, setOpen] = useState(true);

      return (
        <div ref={ref}>
          <Button
            className="rounded-md bg-black/20 py-2 px-4 text-sm font-medium text-white focus:outline-none hover:bg-black/30 focus:outline-1 focus:outline-white"
            onClick={() => {
              setOpen(true);
            }}
          >
            Click
          </Button>
          <HeadlessDialog open={open} onClose={setOpen} className="relative z-10">
            <DialogBackdrop
              transition
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <DialogPanel transition className={cn(panelVariant())}>
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      {icon}
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left text-base font-semibold leading-6 text-gray-900">
                        <DialogTitle as="h3" className={cn(titleVariant())}>
                          {title}
                        </DialogTitle>
                        <div className="mt-2">
                          <p className={cn(contentVariant())}>{content}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    {buttonActions?.map(btn => (
                      <button
                        key={btn.id}
                        type="button"
                        data-autofocus
                        onClick={() => setOpen(false)}
                        className={btn.style}
                      >
                        {btn.name}
                      </button>
                    ))}
                  </div>
                </DialogPanel>
              </div>
            </div>
          </HeadlessDialog>
        </div>
      );
    }
  },
);
