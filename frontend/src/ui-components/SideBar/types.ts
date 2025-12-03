import React from "react";

export interface SideBarProps extends React.BaseHTMLAttributes<HTMLDivElement> {
  headerContents?: ContentProps[];
  mainContents: ContentProps[];
  footerContents?: ContentProps[];
  menu?: string;
  onMenuChange?: (id: string) => void;
}

export interface ContentProps {
  id: string;
  label: string;
  action?: (props: React.BaseHTMLAttributes<HTMLDivElement>) => React.ReactNode;
}
