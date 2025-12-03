export interface SwitchProps {
  id?: string;
  active: boolean;
  onChange: (id: string, enabled: boolean) => void;
}
