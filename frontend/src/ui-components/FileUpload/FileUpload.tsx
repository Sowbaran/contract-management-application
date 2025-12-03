import { PaperClipIcon } from "@heroicons/react/20/solid";
import React, { forwardRef, useRef } from "react";
import { FileUploadProps } from "./types";

export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
  ({ acceptedFileTypes }, ref) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) {
        return;
      }
      const fd = new FormData();
      for (let i = 0; i < files.length; i++) {
        fd.append("file", files[i]);
      }
    };

    const onClickIcon = () => {
      fileInputRef.current?.click();
    };

    return (
      <div
        className="relative inline-block w-6 h-6 bg-transparent cursor-pointer"
        ref={ref}
      >
        <input
          ref={fileInputRef}
          className="hidden"
          type="file"
          onChange={handleFileChange}
          accept={acceptedFileTypes}
        />
        <button
          type="button"
          onClick={onClickIcon}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
        >
          <PaperClipIcon className="text-gray-500 w-6 h-6" />
        </button>
      </div>
    );
  },
);
