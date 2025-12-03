import { useCallback, useEffect, useState } from "react";
import type { AlertProps, CustomAlertStyles } from "./types";
import { Button } from "../Button";
import { cn } from "../../utils";
import { MessageVariants, TitleVariants } from "./styles";

export const Alert = ({
  titleTheme,
  messageTheme,
  open,
  setOpen,
  title,
  message,
  customPopupNode,
  icon,
  customStyles = {},
  additionalUiContents,
  btnActionCallBack,
  enableParentClose,
  enableBackDropClose,
  buttonContents = [
    {
      variant: "green",
      size: "sm",
      label: "Okay",
      buttonStyle: "w-full",
    },
  ],
}: AlertProps) => {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    if (open) {
      setAnimate(true);
    }
  }, [open]);

  const {
    titleStyle,
    titleContainerStyle,
    messageStyle,
    alertBoxContainerStyle,
    alertBoxStyle,
    backdropStyle,
    buttonsContainerStyle,
  } = customStyles as CustomAlertStyles;

  const onClickClose = (buttonId?: string) => {
    setAnimate(false);
    if (animate) {
      setTimeout(() => {
        btnActionCallBack?.(buttonId || "default");
        setOpen?.(false);
      }, 500);
    }
  };

  const closeAlert = useCallback(() => {
    setAnimate(false);
    setTimeout(() => {
      setOpen?.(false);
    }, 500);
  }, [setOpen]);

  const sendActionId = (buttonId?: string) => {
    btnActionCallBack?.(buttonId || "default", closeAlert);
  };

  return (
    <>
      {
        <dialog
          data-open={open}
          data-animate={animate}
          open={open}
          className="group z-50 relative"
          aria-labelledby="modal"
          aria-modal="true"
        >
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
          <div
            onClick={() => enableBackDropClose && onClickClose()}
            className={cn(
              `fixed z-40 inset-0 duration-500 transition-opacity bg-gray-700/80  group-data-[animate=true]:opacity-40 group-data-[animate=false]:opacity-0`,
              backdropStyle,
            )}
          />
          <div
            className={cn(
              "z-50 fixed inset-x-1/2 -translate-x-1/2 inset-y-1/2 w-full max-w-lg flex justify-center items-center transition-transform duration-500 group-data-[animate=true]:scale-100 group-data-[animate=false]:scale-0",
              alertBoxContainerStyle,
            )}
          >
            {customPopupNode || (
              <div
                className={cn(
                  "py-2 pb-4 px-5 flex flex-col justify-between shadow-xl rounded-lg bg-white w-full min-h-40",
                  alertBoxStyle,
                )}
              >
                <div
                  className={cn(`flex flex-row items-center gap-4`, titleContainerStyle)}
                >
                  {icon}
                  <div className={cn("flex flex-col gap-1 my-2")}>
                    {title && (
                      <p className={cn(TitleVariants({ titleTheme }), titleStyle)}>
                        {title}
                      </p>
                    )}
                    {message && (
                      <p className={cn(MessageVariants({ messageTheme }), messageStyle)}>
                        {message}
                      </p>
                    )}
                  </div>
                </div>
                {additionalUiContents}
                <div className={cn("flex flex-row gap-3", buttonsContainerStyle)}>
                  {buttonContents?.length > 0 &&
                    buttonContents.map((item, index) => (
                      <Button
                        key={`${item.id}_${index}`}
                        {...item}
                        onClick={() =>
                          !enableParentClose
                            ? onClickClose(item.id)
                            : sendActionId(item.id)
                        }
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        </dialog>
      }
    </>
  );
};
