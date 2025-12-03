
import { AnyProps } from "../utils/types"

export interface MultiSelectProps extends React.BaseHTMLAttributes<HTMLSelectElement>{
  options?: MultiSelectOption[]
  placeholder?:string,
  maxTextCount?:number,
  customStyle?: CustomMultiSelectStyle,
  values?:MultiSelectOption[]
  onChangeCb?:(item : MultiSelectOption[]) => void
}

export type MultiSelectOption = {
  value:string,
  label:string,
  data?:AnyProps
}

export type CustomMultiSelectStyle = {
  mainContainerStyle?:string,
  selectBtnStyle?:string,
}

