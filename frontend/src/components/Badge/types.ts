export type BadgeProps = {
  shape?:
    | "rounded-none"
    | "rounded"
    | "rounded-md"
    | "rounded-lg"
    | "rounded-full"
    | "";
  value: string;
  color?:
    | "green"
    | "red"
    | "blue"
    | "yellow"
    | "indigo"
    | "purple"
    | "pink"
    | "gray"
    | "amber"
    | "lime"
    | "teal";
};
