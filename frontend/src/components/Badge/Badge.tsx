import { firsLetterToUpperCase } from "../../utils/pickitUtils";
import type { BadgeProps } from "./types";
import { Badge } from "@ui-components";

export function BadgeComponent(props: BadgeProps) {
  const { value } = props;
  const upperStr = firsLetterToUpperCase(value);
  switch (value) {
    case "recall":
      return <Badge label={upperStr} variant="fuchsia"/>;
    case "initiated":
    case "pending":
      return <Badge label={upperStr} variant="yellow2" />;
    case "approved":
      return <Badge label={upperStr} variant="blue2" />;
    case "rejected":
    case "esign-declined":
      return <Badge label={upperStr} variant="red2" />;
    case "esign-initiated":
    case "witness":
      return <Badge label={upperStr} variant="lime2" />;
    case "reset":
      return <Badge label={upperStr} variant="rose" />;
    case "retriggered":
      return <Badge label={upperStr} variant="teal2" />;
    case "completed":
    case "esign-completed":  
      return <Badge label={upperStr} variant="green2" />;
    case "fulfilled":
      return <Badge label={upperStr} variant="pink2" />;
    default:
      upperStr;
      return <Badge label={upperStr} variant="gray2" />;
  }
}
