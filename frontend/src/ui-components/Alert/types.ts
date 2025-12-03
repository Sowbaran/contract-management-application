import { VariantProps } from "class-variance-authority"
import { Dispatch, SetStateAction } from "react"
import { MessageVariants, TitleVariants } from "./styles"
import { ButtonProps } from "../Button/types"


export interface AlertProps extends React.HtmlHTMLAttributes<HTMLDialogElement> , DefalutStyleProps {
  open?:boolean
  type?:"success" | "error" | "default"
  setOpen?:Dispatch<SetStateAction<boolean>>,
  icon?:React.ReactNode,
  title?:string
  message?:string,
  customPopupNode?:React.ReactNode,
  customStyles?:CustomAlertStyles,
  multipleActions?:boolean,
  buttonContents?:ButtonProps[],
  additionalUiContents?:React.ReactNode,
  btnActionCallBack?: (id:string , closeAlert? : (() => void) |  undefined ) => void,
  parentCloseFunc?:() => void,
  enableParentClose?:boolean,
  enableBackDropClose?:boolean,
}

 export interface CustomAlertStyles {
  titleStyle?:string,
  messageStyle?:string,
  backdropStyle?:string,
  alertBoxContainerStyle?:string,
  alertBoxStyle?:string,
  titleContainerStyle?:string,
  buttonsContainerStyle?:string,
  // buttonStyle?:ButtonProps,
}

type DefalutStyleProps = VariantProps<typeof TitleVariants> & VariantProps<typeof MessageVariants>