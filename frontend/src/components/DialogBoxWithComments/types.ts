export type DialogBoxWithCommentsProps = {
  isOpen: boolean;
  title: string;
  btnText: string;
  moduleId: string | undefined;
  emailId: string;
  formId: string | null;
  status: string;
  redirectUrl: string;
  pncHeadFlag?: boolean;
  onClose: () => void; // Include this to provide a way to close the modal
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  onOpenDialog?: (data : any , status : string , redirectUrl?:string) => void
};
