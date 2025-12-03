export type FileUploadProps = {
  title?: string;
  name?: string;
  type?: string;
  allowMultiple?: boolean;
  acceptedFileTypes?: string;
  apiDetails?: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  onUploadSuccess?: (response: any) => void;
  onError?: (error: string) => void;
  s3Urls?: string[];
};
