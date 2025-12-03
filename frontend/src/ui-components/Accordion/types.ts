import { VariantProps } from "class-variance-authority";
import { AccordionHeaderStyle } from "./Accordion";

export interface AccordionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof AccordionHeaderStyle> , CustomAccordionProps {
  onToggle?: (toggleId: string) => void;
  openId?: string;
  selectedId?: string;
  headerLabel?: string;
}

export interface AccordionContentProps
  extends Partial<React.BaseHTMLAttributes<HTMLDivElement>> {}


  export interface CustomAccordionProps {
    mainContainer?:string,
    headerStyle?:string,
    headerBtnStyle?:string,
    contentContainerStyle?:string,
  }