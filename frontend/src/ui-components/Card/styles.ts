import { cva } from "class-variance-authority";

export const CardVariants = cva("bg-white",{
    variants : {
        colorBg : {
            green : "bg-card-greenBg",
            red : "bg-color-redBg",
            yellow : "bg-color-yellowBg",
            black : "bg-color-blackBg",
            orange : "bg-color-orangeBg",
        },
        colorBorder : {
            green : "border border border-card-greenBorder",
            red : "border border-card-redBorder",
            yellow : "border border-card-yellowBorder",
            black : "border border-card-blackBorder",
            orange : "border border-card-orangeBorder",
        }
    }
})