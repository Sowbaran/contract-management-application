export type DialogBoxProps = {
  title: string;
  btnText: string;
  message?:string;
  redirectUrl: string;
  type?:string;
  onClose?: () => void;
};
