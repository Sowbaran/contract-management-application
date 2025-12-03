import type { SlidOversProps } from "./types";
import { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function SlidOvers(props: SlidOversProps) {
  const { children, heading, isOpen, onClose } = props;
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <Transition show={open}>
      <Dialog className="relative z-10" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-30" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-16 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-screen flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="px-1 py-1 sm:px-2">
                      <div className="flex items-start justify-between">
                        <h2
                          id="slide-over-heading"
                          className=" ml-3 text-base font-semibold leading-6 text-gray-900"
                        >
                          {heading}
                        </h2>
                        <div className="ml-1 mt-2 flex h-1 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                            onClick={onClose}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Main */}
                    <div className="px-4 py-6 sm:px-6">{children}</div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
