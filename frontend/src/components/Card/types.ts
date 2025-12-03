import React from "react"

export type CardProps = {
  title?: string
  headerButton?:boolean,
  children?:React.ReactNode,
  onClick?: () => void;
}
