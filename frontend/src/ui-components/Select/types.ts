
import { AnyProps } from "../utils/types";

export interface SelectProps
  extends Omit<React.BaseHTMLAttributes<HTMLSelectElement>, "onChange"> , CustomSelectStyle {
  value?: SelectValueProps;
  options?: { value: string; label: string }[];
  onChange?: (value: SelectValueProps) => void;
  placeholder?: string;
  size?: "sm" | "md";
  enableSearch?: boolean;
  disabled?:boolean;
  bottomSpaceDiff?:number;
}

export type SelectValueProps = {
  label: string;
  value: string;
  data?:AnyProps;
};

export interface CustomSelectStyle {
  containerStyle?: string;
  buttonStyle?: string;
  buttonTextStyle?:string,
  placeholderStyle?:string;
  buttonLabelStyle?: string;
  optionsContainerStyle?: string;
  optionStyle?: string;
  optionTextStyle?:string;
  optionCheckStyle?:string;

}
