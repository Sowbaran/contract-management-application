// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  Bold,
  Essentials,
  Italic,
  Paragraph,
  ClassicEditor,
  List,
  Link,
  Indent,
  Underline,
  FontColor,
  FontBackgroundColor,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css"; // Make sure you have the correct path for CKEditor styles
import "./customStyles.css";

import { RichTextInputProps } from "./types";

export function RichTextInput({ name, value, onChangeIp }: RichTextInputProps) {
  return (
    <div>
      <CKEditor
        editor={ClassicEditor}
        config={{
          plugins: [
            Essentials,
            Bold,
            Italic,
            Paragraph,
            List,
            Indent,
            Underline,
            FontColor,
            FontBackgroundColor,
            Link,
          ],

          toolbar: [
            "undo",
            "redo",
            "|",
            "bold",
            "italic",
            "underline",
            "|",
            "bulletedList",
            "numberedList",
            "|",
            "outdent",
            "indent",
            "|",
            "fontcolor",
            "fontBackgroundColor",
            "|",
            "link",
          ],
        }}
        data={value}
        contextItemMetadata={{
          name,
          yourAdditionalData: 2,
        }}
        onReady={editor => {
          console.log("Editor 1 is ready to use!", editor);
        }}
        onChange={(_event, editor) => {
          onChangeIp(editor.getData());
        }}
      />
    </div>
  );
}
