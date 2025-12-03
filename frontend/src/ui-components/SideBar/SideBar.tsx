import { forwardRef, useState } from "react";
import { ContentProps, SideBarProps } from "./types";

export const SideBar = forwardRef<HTMLDivElement, SideBarProps>(
  ({ menu, mainContents, footerContents, onMenuChange }, ref) => {
    const [isHovered, setIsHovered] = useState("");

    const onClickItem = (item: Omit<ContentProps, "element">) => {
      onMenuChange?.(item.id);
    };

    const ContentRender = (content: ContentProps) => {
      return (
        <button
          type="button"
          className={`relative p-2.5  text-neutral-500  ${menu === content.id ? "bg-[#3C71E1] text-white rounded-md" : "hover:bg-[#2B2B2B] hover:text-neutral-400"} `}
          onClick={() => onClickItem(content)}
          onMouseEnter={() => setIsHovered(content.id)}
          onMouseLeave={() => setIsHovered("")}
        >
          {content.action?.({
            className: "h-6 w-6",
          })}
          {content.id === isHovered && (
            <div className="absolute ml-6 left-full top-1/4 z-10 h-5.5">
              <div className="py-0.5 px-2 flex rounded-md text-sm text-white justify-center items-center bg-black h-full">
                {content.label}
              </div>
            </div>
          )}
        </button>
      );
    };

    return (
      <div
        ref={ref}
        className="flex h-full flex-col justify-between w-[80px] bg-black text-white py-2"
      >
        <div className="flex flex-col flex-grow:1 items-center">
          {mainContents &&
            mainContents.map((content: ContentProps) => (
              <div key={content.id} className=" py-2 cursor-pointer">
                {ContentRender(content)}
              </div>
            ))}
        </div>
        <div className="w-full flex flex-col justify-center items-center">
          {footerContents &&
            footerContents.map((content: ContentProps) => (
              <div key={content.id} className="py-2 cursor-pointer">
                {ContentRender(content)}
              </div>
            ))}
        </div>
      </div>
    );
  },
);
