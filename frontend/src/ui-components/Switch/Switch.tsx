import { Switch as HeadlessSwitch } from "@headlessui/react";
import { forwardRef, useEffect, useState } from "react";
import { SwitchProps } from "./types";

export const Switch = forwardRef<HTMLDivElement, SwitchProps>(
  ({ id = "", active = false, onChange }, ref) => {
    const [enabled, setEnabled] = useState(active);

    const onSwitch = () => {
      setEnabled(prev => {
        const newValue = !prev;
        setTimeout(() => {
          onChange?.(id, newValue);
        }, 200);
        return newValue;
      });
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => 
    {
      active !== enabled && setEnabled(active)
    },[active])

    return (
      <div ref={ref} className="inline-block">
        <HeadlessSwitch
          checked={enabled}
          onChange={onSwitch}
          aria-roledescription="switch"
          aria-checked={active}
          className="group relative flex h-6 w-[41px] cursor-pointer rounded-full bg-gray-400 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-green-600"
        >
          <span
            aria-hidden="true"
            className="absolute left-[3px] top-1/2 h-[19px] w-[19px] -translate-y-1/2 rounded-full bg-white ring-0 shadow-lg transition-transform duration-200 ease-in-out group-data-[checked]:translate-x-[16px]"
          />
        </HeadlessSwitch>
      </div>
    );
  },
);

Switch.displayName = "Switch";
