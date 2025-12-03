import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { forwardRef, useEffect, useRef, useState, useImperativeHandle } from "react";
import { cn } from "../../utils";
import { Input } from "../Input";
import {
  ListboxButtonVariants,
  ListboxContainerVariants,
  ListboxItemVariants,
  ListboxOptionsVariants,
} from "./styles";
import { SelectProps, SelectValueProps } from "./types";

export const Select = forwardRef<{ focus: () => void }, SelectProps>(
  (
    {
      value,
      onChange,
      placeholder = "Select",
      options = [],
      size,
      enableSearch = false,
      disabled = false,
      bottomSpaceDiff = 150,
      ...props
    },
    ref
  ) => {
    const [lisItemOpen, setListItemOpen] = useState(false);
    const [listOptions, setListOptions] = useState<SelectValueProps[]>([]);
    const [dropUp, setDropUp] = useState(false);
    const listboxRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null); // Ref for ListboxButton

    useEffect(() => {
      const handlePosition = () => {
        if (listboxRef.current) {
          const rect = listboxRef.current.getBoundingClientRect();
          const spaceBelow = window.innerHeight - rect.bottom;
          setDropUp(spaceBelow < bottomSpaceDiff);
        }
      };

      handlePosition();
      window.addEventListener("resize", handlePosition);
      
      !lisItemOpen && setListOptions(options);

      return () => window.removeEventListener("resize", handlePosition);
    }, [lisItemOpen, options, bottomSpaceDiff]);

    // Expose focus method via ref
    useImperativeHandle(ref, () => ({
      focus: () => {
        if (buttonRef.current) {
          buttonRef.current.focus();
        }
      },
    }));

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const valueLowerCase = e.target.value.toLowerCase();
      const filtered = options.filter(item =>
        item.label.toLowerCase().includes(valueLowerCase)
      );
      setListOptions(filtered);
    };

    return (
      <div className="relative" ref={listboxRef}>
        <Listbox value={value} onChange={onChange}>
          <div
            className={cn(
              ListboxContainerVariants({ size }) + " " + props.containerStyle
            )}
          >
            <ListboxButton
              ref={buttonRef} // Attach ref to ListboxButton
              disabled={disabled}
              className={cn(
                ListboxButtonVariants({ size }),
                `${lisItemOpen ? "border-primary-300 ring-4 ring-primary-300/50" : "border-gray-300"}`,
                props.buttonStyle
              )}
            >
              <>
                {value ? (
                  <span
                    className={cn(
                      `ml-3 block ${disabled ? "text-gray-500" : "text-gray-700"} truncate`,
                      props.buttonTextStyle
                    )}
                  >
                    {value.label}
                  </span>
                ) : (
                  <span
                    className={cn(
                      "ml-3 block text-gray-300 truncate",
                      props.placeholderStyle
                    )}
                  >
                    {placeholder}
                  </span>
                )}
              </>

              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                {!lisItemOpen ? (
                  <ChevronDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronUpIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                )}
              </span>
            </ListboxButton>
            <ListboxOptions
              ref={node => (node ? setListItemOpen(true) : setListItemOpen(false))}
              transition
              className={cn(
                ListboxOptionsVariants({ size, enableSearch }),
                props.optionsContainerStyle,
                `${dropUp ? "bottom-full mb-2" : "top-full mt-2"}`
              )}
            >
              {enableSearch === true && (
                <div>
                  <Input
                    onChange={onChangeInput}
                    placeholder="Search"
                    className="focus:ring-0"
                    variant="default"
                    iconRight={
                      <MagnifyingGlassIcon
                        strokeWidth={2}
                        className="text-gray-700 w-4 h-4"
                      />
                    }
                    inputPad="right"
                  />
                </div>
              )}

              {listOptions?.map(option => (
                <ListboxOption
                  key={option.value}
                  value={option}
                  className={cn(ListboxItemVariants({ size }), props.optionStyle)}
                  onChange={() => onChange?.(option)}
                >
                  <span
                    className={cn(
                      "ml-0 block truncate group-data-[selected]:font-medium",
                      props.optionTextStyle
                    )}
                  >
                    {option.label}
                  </span>

                  <span
                    className={cn(
                      "absolute inset-y-0 right-0 flex items-center pr-4 text-primary-600 group-data-[focus]:text-primary-600 [.group:not([data-selected])_&]:hidden",
                      props.optionCheckStyle
                    )}
                  >
                    <CheckIcon aria-hidden="true" className="h-5 w-5" />
                  </span>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>
      </div>
    );
  }
);