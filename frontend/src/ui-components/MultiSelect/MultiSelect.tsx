import { useEffect, useRef, useState } from "react";
import type { MultiSelectProps } from "./types";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { cn } from "../../utils";
import { MultiSelectOption } from "../MultiSelect/types";

export const MultiSelect = ({ values = [], placeholder, maxTextCount = 0, onChangeCb, options = [], customStyle }: MultiSelectProps) => {
  const selectedContainerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const [trayCount, setTrayCount] = useState(0);

  const [maxVc, setMaxVc] = useState({ maxCount: 2, remaningWidth: 0 });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {

    if (!selectedContainerRef.current || values.length <= 0) { setTrayCount(0); return }

    const availableWidth = selectedContainerRef.current?.clientWidth - 56;
    let usedWidth = 0
    let visibleCount = 0
    let remainingWidth = 0

    for (let i = 0; i < values.length; i++) {
      const textWidth = (maxTextCount > 5 ? truncateString(values[i].label) : values[i].label).length * 7 + 40

      if ((usedWidth + textWidth) > availableWidth) {
        remainingWidth = availableWidth - usedWidth;

        if (remainingWidth > 50) {
          visibleCount++;
        }
        break;
      }
      usedWidth += textWidth
      visibleCount++;
    }

    setMaxVc(prev => ({ ...prev, maxCount: visibleCount, remaningWidth: remainingWidth }))
    setTrayCount(Math.max(0, values.length - visibleCount))

  }, [values]);

  const onClickItem = (option: MultiSelectOption) => {

    if (values.find(fit => fit.value === option.value))
      onChangeCb?.(values?.filter(item => item.value !== option.value))
    else
      onChangeCb?.([...values, option])
  };

  const truncateString = (value: string) => {
    const truncated = value.length > maxTextCount ? value.slice(0, (Math.max(0, maxTextCount))) + ".." : value
    return truncated
  }

  return (
    <>
      {open && (
        <div
          onMouseDown={() => setOpen(false)}
          className="fixed inset-0 bg-transparent"
        />
      )}
      <div className={cn("relative", customStyle?.mainContainerStyle)}>
        <div
          ref={selectedContainerRef} className={cn("w-full h-10 flex bg-white border border-[#D0D5DD]/70 rounded-lg items-center px-2 ", customStyle?.selectBtnStyle)}
        >
          <div className="z-0 flex gap-2 overflow-x-hidden h-full items-center overflow-y-clip">
            {values?.slice(0, (maxVc?.maxCount)).map((item, index) => (

              <div key={`${item.value}`} className={`${(index >= maxVc?.maxCount - 1 && maxVc?.remaningWidth > 50) && "max-w-[80px]"} transition-opacity opacity-100 flex-shrink-0 px-1 flex gap-[2px] items-center border border-gray-300 rounded-[0.25rem] bg-gray-100`} >
                <span className={`text-sm text-[#637381] flex-shrink-0  ${(index >= maxVc?.maxCount - 1 && maxVc?.remaningWidth > 50) && "truncate max-w-[45px]"}   `}>
                  {maxTextCount > 5 ? truncateString(item.label) : item.label}
                </span>
                <XMarkIcon
                  onClick={() => onClickItem(item)}
                  className="cursor-pointer w-4 h-4"
                />
              </div>

            ))}
          </div>

          <button
            type={"button"}
            className="relative bg-transparent h-full flex-1 flex items-center px-2"
            onClick={() => setOpen(prev => !prev)}
          >
            {values.length <= 0 && (
              <p className="text-slate-300">{placeholder}</p>
            )}

            <div className="absolute flex min-w-10 right-0 justify-end items-center gap-2 bg-white h-full">
              {trayCount > 0 && (
                <div className="w-5 h-5 bg-slate-700 text-[12px] text-white rounded-sm flex justify-center items-center">
                  {trayCount}
                </div>
              )}
              <ChevronDownIcon className="w-4 h-4" />
            </div>
          </button>
        </div>
        {open && (
          <div className="z-10 absolute bg-white shadow-lg translate-y-2 top-full rounded-md inset-x-0 flex ">
            <ul className="flex flex-col gap-2 w-full px-4 max-h-[250px] py-2 overflow-y-auto">
              {options?.map((item, index) => (
                <li key={` ${item.value}_${index}`} className="w-full h-6">
                  <button
                    data-checked={!!(values.length > 0 && values.some(it => it.value === item.value))}
                    onClick={() => onClickItem(item)}
                    type="button"
                    className="group w-full flex-1 flex justify-start items-center gap-3 h-full"
                  >
                    <div className="peer appearance-none h-4 w-4 transition-all bg-white border-[1.5px] border-slate-300 rounded overflow-hidden group-data-[checked=true]:border-primary-600 group-data-[checked=false]:bg-primary-50">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5 group-data-[checked=true]:opacity-100 group-data-[checked=false]:opacity-0"
                        viewBox="0 0 20 20"
                        fill="#3C71E1"
                        stroke="#3C71E1"
                        strokeWidth=".4"
                      >
                        <title>Checkmark icon</title>
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>{" "}
                    </div>
                    <span className="text-gray-900">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}