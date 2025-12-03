import {
  Menu as HeadleassMenu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { forwardRef, useEffect, useState } from "react";
import { cn } from "../../utils";
import { Input } from "../Input";
import {
  MenuButtonVariants,
  MenuContainerVariants,
  MenuItemVariants,
} from "./styles";
import { MenuItemProps, MenuUiProps } from "./types";

export const Menu = forwardRef<HTMLDivElement, MenuUiProps>(
  (
    {
      options,
      label,
      onMenuChange,
      enableIcons = false,
      buttonType = "button",
      avatarSrc = "",
      selectedId = "",

      buttonVariants = { variant: "light" },
      containerVariants = { align: "left" },
      customLabel,
      disabled = false,
      enableSearch = false,
      labelStyle = "",
      customMenuButton,
      requireMenuData = false,
      ...props
    },

    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [listOptions, setListOptions] = useState<MenuItemProps[]>([]);

    const menuButtonStyle = cn(
      MenuButtonVariants(buttonVariants),
      props?.buttonClassName
    );
    const chevronStyle = cn(
      "h-5 w-5 ",
      buttonVariants.variant === "dark" ? "text-white" : "text-slate-700",
      disabled ? "text-slate-300" : ""
    );
    const menuItemSt = cn(
      MenuItemVariants(buttonVariants),
      props?.itemClassName
    );
    const menuContainerSt = cn(
      MenuContainerVariants({ ...buttonVariants, ...containerVariants }),
      props?.containerClassName
    );
    const lblClsx = cn(
      "font-medium leading-5",
      labelStyle,
      disabled ? "text-slate-300" : ""
    );

    const onHandleMenuOpen = () => {
      setOpen((prev) => !prev);
    };

    useEffect(() => {
      !open && setListOptions(options);
    }, [open, options]);

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const valueLowerCase = e.target.value.toLowerCase();
      const filtered = options.filter((item) =>
        item.label.toLowerCase().includes(valueLowerCase)
      );
      setListOptions(filtered);
    };

    const handleMenuChange = (menuId: string , data:MenuItemProps) => {
      onMenuChange?.(menuId , data);
    };

    return (
      <HeadleassMenu
        as="div"
        ref={ref}
        className={ cn("relative inline-block text-left",props.mainContClassName)}
      >
        <div className={ cn("" , props.buttonContClassName)}>
          {buttonType === "button" ? (
            <MenuButton
              disabled={disabled}
              onClick={onHandleMenuOpen}
              className={menuButtonStyle}
            >
              {customLabel ? (
                customLabel
              ) : (
                <div className={cn(lblClsx)}>{label}</div>
              )}
              {open ? (
                <ChevronUpIcon
                  aria-hidden="true"
                  className={cn(chevronStyle)}
                />
              ) : (
                <ChevronDownIcon
                  aria-hidden="true"
                  className={cn(chevronStyle)}
                />
              )}
            </MenuButton>
          ) : (
            buttonType === "custom" && (
              <MenuButton onClick={onHandleMenuOpen} className={props.buttonClassName}>{customMenuButton}</MenuButton>
            )
          )}
        

        <MenuItems
          ref={(node) => {
            if (node) setOpen(true);
            else setOpen(false);
          }}
          // transition
          className={menuContainerSt + " max-h-[300px] , overflow-y-auto"}
        >
          {enableSearch && (
            
              <Input
                onChange={onChangeInput}
                placeholder="Search"
                className="focus:ring-0"
                variant="default"
                containerVar={{ padding: "md" }}
                iconLeft={
                  <MagnifyingGlassIcon
                    strokeWidth={2}
                    className="text-gray-700 w-4 h-4"
                  />
                }
                inputPad="leftSm"
              />
            
          )}
          <div className="py-1">
            {listOptions.map((option, index) => (
              <MenuItem
                as="div"
                data-selected={selectedId === option.id}
                key={option + index.toString()}
                className="flex group"
              >
                {option?.url ? (
                  <a
                    href="link"
                    onClick={() => handleMenuChange(option.id , option)}
                    className={menuItemSt}
                  >
                    <div className="flex gap-2 items-center">
                      {enableIcons && <span>{option.content}</span>}
                      <span className="text-sm leading-6">{option.label}</span>
                    </div>
                    <span className="absolute inset-y-0 right-0 items-center pr-4 text-primary-600 group-data-[selected=true]:text-primary-600 hidden group-data-[selected=true]:flex">
                      <CheckIcon aria-hidden="true" className="h-5 w-5" />
                    </span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleMenuChange(option.id , option)}
                    className={`${menuItemSt}`}
                  >
                    <div className="flex gap-2 items-center">
                      {enableIcons && <span>{option.content}</span>}
                      <span className="text-sm leading-6 whitespace-nowrap">
                        {option.label}
                      </span>
                    </div>
                    <span className="absolute inset-y-0 right-0 items-center pr-4 text-primary-600 group-data-[selected=true]:text-primary-600 hidden group-data-[selected=true]:flex">
                      <CheckIcon aria-hidden="true" className="h-5 w-5" />
                    </span>
                  </button>
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
        </div>
      </HeadleassMenu>
    );
  }
)
