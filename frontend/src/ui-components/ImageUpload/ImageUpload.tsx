import { forwardRef } from "react";
import styled from "styled-components";
import "@pqina/pintura/pintura.css";
import {
  createDefaultImageReader,
  createDefaultImageWriter,
  createDefaultShapePreprocessor,
  legacyDataToImageState,
  locale_en_gb,
  openEditor,
  plugin_crop,
  plugin_crop_locale_en_gb,
  plugin_finetune_defaults,
  processImage,
  setPlugins,
} from "@pqina/pintura";

import "filepond/dist/filepond.min.css";
import "filepond-plugin-file-poster/dist/filepond-plugin-file-poster.min.css";
import { UserIcon } from "@heroicons/react/20/solid";
// @ts-ignore
import FilePondPluginImageEditor from "@pqina/filepond-plugin-image-editor";
import FilePondPluginFilePoster from "filepond-plugin-file-poster";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import { FilePond, registerPlugin } from "react-filepond";
import { ImageUploadProps } from "./types";

registerPlugin(
  FilePondPluginImageEditor,
  FilePondPluginFilePoster,
  FilePondPluginFileValidateType,
);
setPlugins(plugin_crop);

export const ImageUpload = forwardRef<HTMLDivElement, ImageUploadProps>(
  ({ acceptedFileTypes }, ref) => {
    const StyledFilePond = styled(FilePond)`
      .filepond--item {
        width: 185px !important;
        height: 185px !important;
        margin: 0;
      }

      .filepond--item-panel {
        background-color: transparent;
        border: 0px;
      }
      .filepond--file {
        padding: 0px;
      }

      .filepond--panel {
        background-color: transparent;
        padding: 0px !important;
      }

      .filepond--drop-label {
        color: #333;
        cursor: pointer;
      }

      .filepond--file-action-button {
        cursor: pointer;
        margin-top: 7px;
      }

      .filepond--browser {
        height: 185px !important;
        cursor: pointer !important;
      }

      .filepond--list-scroller {
        margin: 0 !important;
      }

      .filepond--file-poster {
        background-color: transparent;
      }
      .filepond--file-info {
        visibility: hidden;
      }

      .filepond--file-action-button.filepond--action-remove-item,
      .filepond--file-action-button.filepond--action-edit-item {
        visibility: hidden !important;
        opacity: 0 !important;
        transition:
          visibility 0s linear 0.3s,
          opacity 0.3s ease-in-out !important;
      }

      .filepond--item:hover
        .filepond--file-action-button.filepond--action-remove-item,
      .filepond--item:hover
        .filepond--file-action-button.filepond--action-edit-item {
        visibility: visible !important;
        opacity: 1 !important;
        transition:
          visibility 0s linear 0s,
          opacity 0.3s ease-in-out !important;
      }

      .filepond--file-poster-overlay {
        visibility: hidden !important;
      }

      .filepond--file-action-button.filepond--action-retry-item-load {
        background-color: transparent !important;
        visibility: hidden !important;
      }

      .filepond--load-indicator {
        background-color: transparent !important;
        margin-top : 5px !important;
      }

      .filepond--action-abort-item-load {
        visibility: hidden !important;
      }
    `;

    return (
      <div ref={ref} className="relative inline-block h-[185px]  m-1">
        <div className="absolute bg-primary-900 w-[183px] h-[181px] rounded-md mt-[1px] ml-[1px] ">
          <div className="absolute text-[#FFFFFF] opacity-10  w-[114px] h-[114px]  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <UserIcon className="w-full h-full" />
          </div>
        </div>
        <StyledFilePond
          className="flex justify-center w-[185px] h-[185px] -ml-3"
          credits={false}
          files={[]}
          labelIdle=""
          acceptedFileTypes={acceptedFileTypes}
          labelTapToCancel=""
          labelFileLoading=""
          name="files"
          imageEditor={{
            legacyDataToImageState: legacyDataToImageState,

            createEditor: openEditor,

            imageReader: [createDefaultImageReader, {}],

            imageWriter: [createDefaultImageWriter, {}],

            imageProcessor: processImage,

            editorOptions: {
              utils: ["crop"],
              shapePreprocessor: createDefaultShapePreprocessor(),
              ...plugin_finetune_defaults,
              locale: {
                ...locale_en_gb,
                ...plugin_crop_locale_en_gb,
              },
            },
          }}
        />
      </div>
    );
  },
);
