import type { LabelProps } from "./types";
import { cn } from "../../utils";
import { LabelVariants } from "./styles";

export const Label = ({ htmlFor, className, text, lblColor, lblSize , fontWeight }: LabelProps) => {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className={cn(LabelVariants({ lblColor, lblSize , fontWeight }))}
      >
        {text}
      </label>
    </div>
  );
};
