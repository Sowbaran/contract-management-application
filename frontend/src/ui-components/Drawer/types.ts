import React from "react";

export interface DrawerProps extends React.BaseHTMLAttributes<HTMLDivElement> , CustomDrawerStyle{
  open?: boolean;
  handleOpen?: (drawerOpen: boolean) => void;
  enableZindex?: boolean;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  mainContent?: React.ReactNode;
  enableScroll?:boolean;
  enableDefaultClose?:boolean;
  defaultCloseBtn?:React.ReactNode;
  unmount?:boolean
}


export interface CustomDrawerStyle {
   backgroudPanelStyle? : string
   dialogPanelstyle? : string
   defaultCloseBtnStyle? : string
   contentContainerStyle? : string
   headerContentStyle? :string
   mainContentStyle? :string
   footerContentStyle? : string
}