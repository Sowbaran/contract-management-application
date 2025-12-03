import { VariantProps } from "class-variance-authority";
import { BadgeVariants } from "./styles";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Partial<VariantProps<typeof BadgeVariants>> {
  label: string;
  labelClassName? : string;
  icon? : React.ReactNode;
  additionalClass?: string;
}
