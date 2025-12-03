export type AlertProps = {
  type: "info" | "success" | "warning" | "error";
  message: string;
  linkText?: string;
  linkUrl?: string;
  showDismiss?: boolean;
  description?: string;
  onDismiss?: () => void;
  autoHideDuration?: number; // in milliseconds
};
