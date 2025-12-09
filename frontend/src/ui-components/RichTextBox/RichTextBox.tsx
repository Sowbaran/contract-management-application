import type { RichTextBoxProps } from "./types";
import ReactQuill from "react-quill";
import "./RichTextBox.css";
import { forwardRef, useRef, useImperativeHandle } from "react";

export interface RichTextBoxRef {
  focus: () => void;
}

export const RichTextBox = forwardRef<RichTextBoxRef, RichTextBoxProps>(
  ({ value, onChange, placeholder, ...props }, ref) => {
    const quillRef = useRef<ReactQuill>(null);

    // Expose focus method via ref
    useImperativeHandle(ref, () => ({
      focus: () => {
        if (quillRef.current) {
          quillRef.current.focus();
        }
      },
    }));

    // Ensure value is always defined to prevent uncontrolled to controlled warning
    const safeValue = value ?? "";

    return (
      <div className="">
        <link
          rel="stylesheet"
          href="https://unpkg.com/react-quill@1.3.3/dist/quill.snow.css"
        />
        <ReactQuill
          ref={quillRef}
          className="ql-toolbar ql-container"
          theme="snow"
          placeholder={placeholder}
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike", "link"],
              [{ list: "ordered" }, { list: "bullet" }],
            ],
            history: {
              delay: 2000,
              maxStack: 500,
              userOnly: true,
            },
          }}
          value={safeValue}
          onChange={onChange}
          {...props}
        />
      </div>
    );
  }
);