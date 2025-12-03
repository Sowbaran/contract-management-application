export type CheckboxGroupProps = {
  label?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
  defaultChecked?: boolean;
  orientation?: string;
  size?: "sm" | "md";
  dynamicOptions?: CheckboxOption[];
};

export interface CheckboxOption {
  label?: string;
  description?: string;
  disabled?: boolean;
  value?: string;
  defaultChecked?: boolean;
}
