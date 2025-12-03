import { TabVariants } from "./styles";

export interface TabProp {
  id: string;
  name?: string;
}

export interface TabGroupProp extends React.BaseHTMLAttributes<HTMLDivElement> , CustomTabStyles {
  tabList: TabProp[],
  onTabChange?: (item: TabProp) => void,
  variants? : keyof typeof TabVariants;
  selectedTab? : string
}


export interface CustomTabStyles {
  containerStyle? : string,
  tabContainerStyle? : string
  tabGroupStyle? : string,
  tabListStyle? : string,
  tabStyle? : string,
}