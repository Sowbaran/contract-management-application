export interface DialogProps extends React.BaseHTMLAttributes<HTMLDivElement> {
  title: string;
  content: string;
  buttonActions?: DialogButtonPorps[];
  icon?: React.ReactNode;
}

export interface DialogButtonPorps {
  id: string;
  name: string;
  style: string;
}
