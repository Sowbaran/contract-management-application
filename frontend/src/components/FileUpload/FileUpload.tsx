import type { FileUploadProps } from "./types";
import type { FilePondFile, FilePondInitialFile } from "filepond";
import { FilePond, registerPlugin } from "react-filepond";
// Import FilePond styles
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import {
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { getSignedUrl, uploadFileToS3 } from "../../utils/api";

// Register the plugins
registerPlugin(
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview
);

export function FileUpload({
  title,
  name,
  type,
  allowMultiple = false,
  acceptedFileTypes = [],
  apiDetails,
  onUploadSuccess,
  onError,
  s3Urls = [],
  formDataStatus,
  mandatory = true
}: FileUploadProps) {
  // const [files, setFiles] = useState<FilePondFile[]>([]);

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [uploadedLinks, setUploadedLinks] = useState<string[]>([]);
  const [s3Links, setS3Links] = useState<string[]>([]);
  const [s3Files, setS3Files] = useState<FilePondInitialFile[]>([]);

  const [currentUploadedFiles, setCurrentUploadedFiles] = useState<FilePondInitialFile[]>(
    []
  );

  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [alreadyUploadedFilesErrorMsg, setAlreadyUploadedFilesErrorMsg] =
    useState<string>("");

  // const [singleFileUploadFlag, setSingleFileUploadFlag] =
  //   useState<boolean>(false);
  // const [multiFileUploadFlag, setMultiFileUploadFlag] =
  //   useState<boolean>(false);

  useEffect(() => {
    if (s3Links?.length > 0) {
      const mergedFiles = [...uploadedLinks, ...s3Links];
      // console.log("final links to server ------------ ", mergedFiles);
      onUploadSuccess?.(mergedFiles);
    } else {
      // console.log("final links to server ------------------ ", uploadedLinks);
      onUploadSuccess?.(uploadedLinks);
    }
  }, [uploadedLinks, s3Links, onUploadSuccess]);

  useEffect(() => {
    if (s3Urls?.length > 0) {
      setS3Links(s3Urls);
      const preloadFiles: FilePondInitialFile[] = s3Urls?.map(url => ({
        source: url,
        options: {
          type: "input",
          file: {
            name: `${url}`,
            type: "application/octet-stream",
            size: 0
          },
          metadata: {
            poster: url
          }
        }
      }));
      setS3Files(preloadFiles);
    }
  }, [s3Urls]);

  useEffect(() => {
    if (uploadedLinks?.length > 0) {
      const preloadFiles: FilePondInitialFile[] = uploadedLinks?.map(url => ({
        source: url,
        options: {
          type: "local",
          file: {
            name: `${url}`,
            type: "application/octet-stream",
            size: 0
          },
          metadata: {
            poster: url
          }
        }
      }));
      setCurrentUploadedFiles(preloadFiles);
    }
  }, [uploadedLinks]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (type === "file" || type === "arrayFile") {
      if (newFiles.length > 0) {
        type === "file" ? handleSingleUpload() : handleMultipleUploads();
      }
    }
  }, [newFiles]);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleAddFile = (error: any, file: FilePondFile) => {
    if (file.source instanceof File) {
      if (error) {
        setErrorMessage(error.message);
        setUploadSuccess(false);
        setIsUploading(false);
        onError?.(error.message);
        return;
      }
      setAlreadyUploadedFilesErrorMsg("");

      setNewFiles(prev => [...prev, file.file as File]);
      setErrorMessage(null);
      File;
      setUploadSuccess(false);
    }
    // setSingleFileUploadFlag(false);
    // setMultiFileUploadFlag(false);
  };

  const generateRandomId = async () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

  const processFileName = async (fileName: string): Promise<string> => {
    // Remove file extension
    const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf("."));

    // Limit file name to 20 characters
    const trimmedFileName =
      fileNameWithoutExtension.length > 20
        ? fileNameWithoutExtension.substring(0, 20)
        : fileNameWithoutExtension;

    // Remove the first special character and replace subsequent special characters with an underscore
    const updatedFileName = trimmedFileName
      .replace(/[^a-zA-Z0-9]/, "") // Remove the first special character
      .replace(/[^a-zA-Z0-9]/g, "_"); // Replace subsequent special characters with an underscore

    return updatedFileName;
  };

  // Map MIME types to file extensions
  const getFileExtension = async (mimeType: string): Promise<string> => {
    const mimeTypes: { [key: string]: string } = {
      "application/msword": "doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
      "application/pdf": "pdf"
    };

    return mimeTypes[mimeType] || "unknown"; // Fallback if the MIME type is not recognized
  };

  const handleSingleUpload = async () => {
    setIsUploading(true);
    try {
      if (!newFiles.length) {
        setErrorMessage("Select a file");
        onError?.("Select a file");
      }

      const selectedFile = newFiles[0];

      let updatedFileName = "";
      if (selectedFile) {
        updatedFileName = await processFileName(selectedFile.name);
      }

      // Generate unique file name
      const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
      const randomId = await generateRandomId();
      const fileExtension = await getFileExtension(selectedFile?.type || "");
      const uniqueFileName = `${updatedFileName}_${timestamp}_${randomId}.${fileExtension}`;
      const key = `msadocuments/${uniqueFileName}`;

      // Generate signed URL for the file
      const apiBasePath = apiDetails || "document-handler/generate-signedurl";
      const signedUrlEndpoint = `${apiBasePath}?key=${key}&contentType=${selectedFile?.type}`;

      const signedUrl = await getSignedUrl(signedUrlEndpoint);

      // Upload file to S3
      await uploadFileToS3(signedUrl.url, selectedFile as File);

      setUploadedLinks([key]);
      setNewFiles([]);
      setUploadSuccess(true);
      // setSingleFileUploadFlag(true);
    } catch (err) {
      console.error("Error in uploading process:", err);
      setErrorMessage("Error in uploading process");
      onError?.("Error in uploading process");
    } finally {
      setIsUploading(false);
    }
  };

  const handleMultipleUploads = async () => {
    setIsUploading(true);
    try {
      if (!newFiles.length) {
        setErrorMessage("Select a file");
        onError?.("Select a file");
      }

      const uploadedFileUrls: string[] = [];
      for (const selectedFile of newFiles) {
        let updatedFileName = "";
        if (selectedFile) {
          updatedFileName = await processFileName(selectedFile.name);
        }
        // Generate a unique file name
        const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
        const randomId = await generateRandomId();
        const fileExtension = await getFileExtension(selectedFile?.type || "");
        const uniqueFileName = `${updatedFileName}_${timestamp}_${randomId}.${fileExtension}`;
        const key = `formdocuments/${uniqueFileName}`;

        // Generate signed URL for the file
        const apiBasePath = apiDetails || "document-handler/generate-signedurl";
        const signedUrlEndpoint = `${apiBasePath}?key=${key}&contentType=${selectedFile?.type}`;
        // console.log(signedUrlEndpoint);

        const signedUrl = await getSignedUrl(signedUrlEndpoint);
        console.log(signedUrl);

        // Upload the file to S3 using the signed URL
        await uploadFileToS3(signedUrl.url, selectedFile);

        // Save the signed URL to the array
        uploadedFileUrls.push(key);
      }

      // Update the state with the uploaded files' URLs
      setUploadedLinks(prev => [...prev, ...uploadedFileUrls]);
      setNewFiles([]);
      setUploadSuccess(true);
      // setMultiFileUploadFlag(true);
    } catch (err) {
      console.error("Error in uploading process:", err);
      setErrorMessage("Error in uploading process");
      onError?.("Error in uploading process");
    } finally {
      setIsUploading(false);
    }
  };

  const handleBeforeRemove = (file: FilePondFile) => {
    setUploadSuccess(false);
    if (
      s3Links?.includes(file.filename) &&
      formDataStatus &&
      formDataStatus === "rejected"
    ) {
      // setAlreadyUploadedFilesErrorMsg(
      //   "You can't delete files that have already been uploaded."
      // );
      // return false; // Prevent removal
    }

    if (s3Links?.length > 0 && s3Links.includes(file.filename)) {
      setS3Links(prev => prev.filter(key => key !== file.filename));
    } else if (uploadedLinks?.length > 0) {
      setUploadedLinks(prev => prev.filter(key => key !== file.filename));
    }

    if (typeof file.source === "string") {
      setS3Files(prev => prev.filter(it => it.options.file?.name !== file.filename));
      setCurrentUploadedFiles(prev =>
        prev.filter(it => it.options.file?.name !== file.filename)
      );
      return true;
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
      setNewFiles(prev => prev.filter(it => it.name !== file.filename));
      return true;
    }
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleRemoveFile = (error: any) => {
    setErrorMessage(error);
    setIsUploading(false);
  };

  const handleProcessFile = () => {
    setUploadSuccess(true);
    setErrorMessage(null);
    setIsUploading(false);
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleProcessFileAbort = (error: any) => {
    setUploadSuccess(false);
    setErrorMessage(error.main);
    setIsUploading(false);
    onError?.(error.main);
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleWarning = (error: any) => {
    const errorMsg = error.body.includes("exceeds")
      ? "File size exceeds the 10MB limit."
      : error.body;
    setErrorMessage(errorMsg);
    setIsUploading(false);
    onError?.(errorMsg);
  };

  const handleBeforeAdd = (file: FilePondFile) => {
    if (newFiles.some(it => it.name === file.filename)) {
      return false;
    }
    return true;
  };

  // need this for debug if any issues
  //  console.log("**************** start log");
  // console.log("s3Links -- ", s3Links);
  // console.log("s3Files -- ", s3Files);
  // console.log("newFiles -- ", newFiles);
  // console.log("uploaded links -- ", uploadedLinks);
  // console.log("uploaded files -- ", currentUploadedFiles);

  return (
    <div className="flex flex-col">
      <label
        htmlFor="thumbnail"
        className="block text-md leading-6 text-gray-900 sm:pt-1.5 mb-2"
      >
        {title}
        {mandatory && <span className="text-md text-red-600"> * </span>}
      </label>
      <div className="justify-center rounded-lg border border-gray-200">
        <style>
          {`
          .filepond--root {
          margin-bottom:0
          }
            .filepond--file-info {
            margin-top:5px;
            }
          .filepond--file-info-sub {
            display: none; /* Hide file size text */
          }
            .filepond--panel-root {
            background-color:transparent
          }
        `}
        </style>
        <FilePond
          labelIdle='<span style="color:#0062FF; font-size:14px; ">Click to upload</span> <span style="color:#475467; font-size:12px;">or drag and drop</span>'
          name={name}
          acceptedFileTypes={acceptedFileTypes}
          allowDrop={true}
          allowMultiple={allowMultiple}
          onaddfile={handleAddFile}
          onremovefile={handleRemoveFile}
          beforeRemoveFile={handleBeforeRemove}
          beforeAddFile={handleBeforeAdd}
          onprocessfile={handleProcessFile}
          onprocessfileabort={handleProcessFileAbort}
          onwarning={handleWarning}
          credits={false}
          files={[...newFiles, ...s3Files, ...currentUploadedFiles]}
        />

        <div className="text-center text-gray-700">
          {uploadSuccess ? (
            <div className="flex justify-center gap-2">
              <CheckCircleIcon className={"h-5 w-5 mt-[2px] text-green-500"} />
              <p className="pb-1">
                {currentUploadedFiles.length > 1
                  ? "Files uploaded successfully!"
                  : "File uploaded successfully!"}
              </p>
            </div>
          ) : (
            isUploading && (
              <div className="flex justify-center gap-2 mt-2">
                <ArrowUpTrayIcon className={"h-5 w-5 text-blue-700"} />
                Uploading...
              </div>
            )
          )}
          {errorMessage && (
            <div className="flex justify-center gap-2 mt-2">
              <ExclamationCircleIcon className={"h-5 w-5 text-red-600"} />
              {errorMessage}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          {type === "file" &&
            newFiles.length === 0 &&
            currentUploadedFiles.length === 0 &&
            s3Files.length === 0 &&
            mandatory === true && (
              <p className="text-red-600 text-[12px]">Field is required</p>
            )}

          {/* {type === "arrayFile" &&
            newFiles.length === 0 &&
            currentUploadedFiles.length === 0 &&
            s3Files.length === 0 && (
              <p className="text-red-600 text-[12px]">No documents uploaded</p>
            )} */}

          {type === "arrayFile" && alreadyUploadedFilesErrorMsg !== "" && (
            <p className="text-red-600 text-[12px]">{alreadyUploadedFilesErrorMsg}</p>
          )}
        </div>
      </div>
    </div>
  );
}
