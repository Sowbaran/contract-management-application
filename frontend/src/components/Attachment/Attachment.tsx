import { PhotoIcon } from "@heroicons/react/24/outline";
import type { AttachmentProps } from "./types";
import { useState } from "react";

export function Attachment(props: AttachmentProps) {
  const [, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success] = useState<string | null>(null);

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);

      try {
        setUploading(true);
        setError(null);
        // const response = await uploadFile(selectedFile);
        // setSuccess('File uploaded successfully!');
        // console.log('Response:', response.data);
        // Call the callback function with the response data
        // if(props.onFileUpload){
        //   props.onFileUpload(response?.data);
        // }
      } catch (error) {
        setError('Error uploading file.');
        console.error(error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-4">
      <label
        htmlFor="cover-photo"
        className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
      >
        {props.name}
        {props.required && <span style={{ color: "red" }}>*</span>}
      </label>
      <div className="mt-2 sm:col-span-2 sm:mt-0">
        <div className="flex max-w-2xl justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
          <div className="text-center">
            <PhotoIcon
              className="mx-auto h-12 w-12 text-gray-300"
              aria-hidden="true"
            />
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-600 focus-within:ring-offset-2 hover:text-green-500"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={onFileChange}
                  disabled={uploading}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-gray-600">
              PNG, JPG, GIF up to 10MB
            </p>
            {uploading && <p className="text-sm text-blue-600">Uploading...</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
