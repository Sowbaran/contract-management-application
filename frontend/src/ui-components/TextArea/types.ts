export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    additionalStyles? : CustomTextAreaStyles
  }

 export interface CustomTextAreaStyles {
    containerStyle? : string,
    textareaStyle? : string,
  }
