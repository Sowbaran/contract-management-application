import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import { RichTextBox } from ".";

describe("<RichTextBox />", () => {
  it("renders", () => {
    render(<RichTextBox name="richtextbox" value="" onChange={() => {}} />);
  });
});
