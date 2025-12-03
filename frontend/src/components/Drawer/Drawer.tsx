import { Dialog, DialogPanel } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { forwardRef } from "react";
import { DrawerProps } from "./types";
import { cn } from "../../utils";

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  ({
    children,
    open,
    handleOpen,
    enableZindex,
    headerContent,
    footerContent,
    mainContent,
    enableDefaultClose = true,

    ...props
  }) => {
    const bgStyle = cn("sticky z-50", enableZindex
      ? `transition duration-500  ${
          open ? "bg-slate-900/20 opacity-100" : "bg-slate-900/20 opacity-0"
        } bg-slate-900/20 fixed inset-0 overflow-hidden`
      : "" )


      const backgroudPanelSty = cn(" pointer-events-auto w-screen max-w-[839px] transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700" , props.backgroudPanelStyle)
      const dialogPanelsty = cn("relative flex h-full flex-col  bg-white shadow-xl" , props.dialogPanelstyle)
      const defaultCloseBtnSty = cn("absolute top-1/3" , props.defaultCloseBtnStyle)
      const contentContainerSty = cn("flex flex-col h-full" , props.contentContainerStyle)
      const headerContentSty = cn("relative flex justify-between items-center px-5 h-10 border border-b-slate-200" , props.headerContentStyle)
      const mainContentSty = cn("relative flex-grow" , props.mainContentStyle)
      const footerContentSty = cn("relative px-5 h-[58px] bg-white shadow-[0_2px_20px_-13px_rgba(0,0,0,1)]" , props.footerContentStyle)


    return (
      <>
        {enableZindex ? (
          <Dialog
            open={open}
            onClose={() => {
              enableZindex && handleOpen?.(false);
            }}
          >
            <div className={`${bgStyle}`}>
              <div className="fixed inset-y-0 right-0 flex">
                <DialogPanel
                  transition
                  className={backgroudPanelSty}
                >
                  <div className={dialogPanelsty}>
                    {enableDefaultClose && (
                      <div className={defaultCloseBtnSty}>
                        <button
                          type="button"
                          onClick={() => handleOpen?.(false)}
                          className="cursor-pointer relative z-50 -left-3 p-1 rounded-full bg-white  text-slate-500  focus:outline-none shadow-xl ring-1 ring-slate-100"
                        >
                          <ChevronRightIcon
                            aria-hidden="true"
                            className="h-5 w-5"
                          />
                        </button>
                      </div>
                    )}
                    <div className={contentContainerSty}>
                      {headerContent && (
                        <div className={headerContentSty}>
                          {headerContent}
                        </div>
                      )}
                      <div className={mainContentSty}>{mainContent}</div>
                      {footerContent && (
                        <div className={footerContentSty}>
                          {footerContent}
                        </div>
                      )}
                    </div>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </Dialog>
        ) : (
          <>
            {open && (
              <div
                className={`ml-5 relative transition-all duration-500 ease-in-out w-[400px] translate-x-0 ${
                  open ? "translate-x-0" : "translate-x-[400px]"
                }`}
              >
                <div className="p-2">
                  <div className="absolute inset-0 bg-slate-900">
                    <div className="relative flex h-full">
                      <button
                        type="button"
                        className="absolute  -left-2.5 top-1/4 text-white rounded-full p-1 bg-gray-700 hover:text-white focus:outline-none "
                        onClick={() => handleOpen?.(false)}
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="relative">{children}</div>
                </div>
              </div>
            )}
          </>
        )}
      </>
    );
  }
);
