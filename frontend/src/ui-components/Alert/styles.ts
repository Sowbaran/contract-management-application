import { cva } from "class-variance-authority"

export const TitleVariants = cva("text-md",{
    variants : {
        titleTheme : {
            default : "text-gray-900 font-500",
            success:"text-green-500 font-500",
            error:"text-red-500 font-500",
        }
    },
    defaultVariants : {
        titleTheme : "default"
    }
}) 

export const MessageVariants = cva("",{
    variants : {
        messageTheme : {
            default : "text-sm text-gray-400 font-400",
        }
    },
    defaultVariants : {
        messageTheme : "default"
    }
}) 