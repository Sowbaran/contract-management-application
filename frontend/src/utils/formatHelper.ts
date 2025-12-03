import dayjs from "dayjs";

type BadgeColorType =
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

export const workflowStatusColorMapping = (value: string): BadgeColorType => {
  switch (value) {
    case "pending":
      return "yellow";
    case "rejected":
      return "red";
    case "completed":
      return "green";
    case "approved":
      return "blue";
    case "fulfilled":
      return "pink";
    case "esign-initiated":
      return "lime";
    case "esign-rejected":
      return "amber";
    case "esign-completed":
      return "teal";
    default:
      return "gray";
  }
};

export const statusColorMapping = (value: string): BadgeColorType => {
  return value ? "green" : "red";
};

export const dateTimeFormatter = (value: string) => {
  return value ? dayjs(value).format("DD MMM, YYYY hh:mm A") : "";
};

export const dateFormatter = (value: string) => {
  return value ? dayjs(value).format("DD MMM, YYYY") : "";
};

export const dateTimeFormatter_2 = (value: string) => {
  return value ? dayjs(value).format("DD/MM/YYYY hh:mm A") : "";
};

export const dateFormatter_2 = (value: string) => {
  return value ? dayjs(value).format("DD/MM/YYYY") : "";
};
