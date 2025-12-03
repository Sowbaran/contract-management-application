import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "./Input";

describe("Input Component", () => {
  it("renders with default variant and placeholder", () => {
    render(<Input variant="default" placeholder="Text" />);

    const inputElement = screen.getByPlaceholderText("Text");
    expect(inputElement).toBeInTheDocument();
  });

  it("renders with ourline variant and placeholder", () => {
    render(<Input variant="error" placeholder="Text" />);

    const inputElement = screen.getByPlaceholderText("Text");
    expect(inputElement).toBeInTheDocument();
  });
});
