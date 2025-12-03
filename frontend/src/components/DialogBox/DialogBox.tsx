import type { DialogBoxProps } from "./types";
import { Fragment, useState } from "react";
import { Dialog, DialogPanel, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "@tanstack/react-router";

export function DialogBox({
  title,
  btnText,
  redirectUrl,
  message = "",
  type = "",
  onClose,
}: DialogBoxProps) 
{
  const navigate = useNavigate({ from: "/finance/vendor-contract/requests" });

  const[open , setOpen] = useState(true);
  const handleAPICall = () => {
    redirectUrl ? navigate({ to: `${redirectUrl}` }) : onClickClose();
  };

  const onClickClose = () => {
    setOpen(false);
    onClose?.()
  } 

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-y-auto z-30"
        onClose={onClickClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <DialogPanel className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div className="fixed inset-0 flex items-center justify-center">
            <Dialog.Panel className="bg-white rounded-lg px-4 pt-5 pb-4 overflow-y-auto text-center shadow-xl transform transition-all sm:max-w-lg sm:w-full">
              <div>
                {
                  type === "error" ? (
                    <p
                      className="font-bold text-lg text-red-600"
                    >{title}</p>
                  ) : (
                    <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-green-100">
                      <CheckIcon
                        className="h-5 w-5 text-green-600"
                        aria-hidden="true"
                      />
                    </div>
                  )
                }
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="textmd leading-6 font-medium text-gray-900"
                  >
                    {message}
                  </Dialog.Title>
                  <div className="mt-2" />
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className={`inline-flex justify-center w-half rounded-md border border-transparent px-4 py-1  ${type==="error" ? "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500"  : "bg-green-600 hover:bg-green-700 focus-visible:ring-green-500"} text-base font-medium text-white shadow-sm  focus-visible:ring-2 focus-visible:ring-offset-2  sm:text-sm`}
                    onClick={handleAPICall}
                  >
                    {btnText}
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
}
