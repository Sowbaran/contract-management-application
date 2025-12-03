export * from "./types";


/**
 *
 * @param className string of classes
 * @returns classNames tagged as important
 */

import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...input: ClassValue[]) {
  return twMerge(clsx(input));
}
export function applyImportant(className: string) {
  if (!className) return "";
  return className
    .split(" ")
    .map(cls => `!${cls}`)
    .join(" ");
}
