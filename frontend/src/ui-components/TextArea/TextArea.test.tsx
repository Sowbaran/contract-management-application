import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TextArea } from "./TextArea";

describe("TextArea Component", () => {
  it("renders with placeholder", () => {
    render(<TextArea placeholder="Enter your text..." />);

    const placeholderText = screen.getByPlaceholderText("Enter your text...");
    expect(placeholderText).toBeInTheDocument();
  });

  it("renders with custom height", () => {
    render(<TextArea placeholder="Enter your text..." style={{ minHeight: "150px" }} />);

    const textareaElement = screen.getByPlaceholderText("Enter your text...");
    expect(textareaElement).toHaveStyle("min-height: 150px");
  });

  it("renders as disabled", () => {
    render(<TextArea placeholder="Enter your text..." disabled />);

    const textareaElement = screen.getByPlaceholderText("Enter your text...");
    expect(textareaElement).toBeDisabled();
  });

  it("renders with error styling", () => {
    render(
      <TextArea
        placeholder="Enter your text..."
        className="border-red-500 focus-visible:ring-red-500"
      />,
    );

    const textareaElement = screen.getByPlaceholderText("Enter your text...");
    expect(textareaElement).toHaveClass("border-red-500");
  });

  it("renders with pre-filled text", () => {
    render(<TextArea value="This is pre-filled text." />);

    const textareaElement = screen.getByDisplayValue("This is pre-filled text.");
    expect(textareaElement).toBeInTheDocument();
  });
});
