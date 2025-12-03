export type AttachmentProps = {
  name: string;
  message?: string;
  required?:boolean;
  onFileUpload?: (response: string) => void;
};
