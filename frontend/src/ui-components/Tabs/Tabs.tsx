import { Tab, TabGroup, TabList } from "@headlessui/react";
import { forwardRef } from "react";
import { TabGroupProp, TabProp } from "./types";
import { cn } from "../../utils";
import { TabVariants } from "./styles";

export const Tabs = forwardRef<HTMLDivElement, TabGroupProp>(
  (
    {
      tabList,
      onTabChange,
      selectedTab,
      variants = "default",
      containerStyle,
      tabStyle,
      tabGroupStyle,
      tabListStyle,
      tabContainerStyle,
    },
    ref
  ) => {
    const variantStyles = TabVariants[variants];
    const { mainContainer, tabContainer, tabGroup, tabListGroup, tab } =
      variantStyles;

    const onSelectTab = (tabIndex: number) => {
      const item = {...tabList[tabIndex]};
      item && onTabChange?.(item);
    };

    return (
      <div ref={ref} className={cn(mainContainer, containerStyle)}>
        
        <div className={cn(tabContainer, tabContainerStyle)}>
          <TabGroup
            className={cn(tabGroup, tabGroupStyle)}
            onChange={(i) => onSelectTab(i)}
            selectedIndex={tabList.findIndex(item => item.id === selectedTab)}
          
          >
            <TabList className={cn(tabListGroup, tabListStyle)}>
              {tabList?.map((item: TabProp) => (
                <Tab id={item.id} key={item.id} className={cn(tab, tabStyle)}>
                  {item.name}
                </Tab>
              ))}
            </TabList>
          </TabGroup>
        </div>
      </div>
    );
  }
);
