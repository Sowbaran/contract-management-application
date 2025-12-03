import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./Select";

describe("Select Component", () => {
  const defaultOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const defaultProps = {
    options: defaultOptions,
    onChange: vi.fn(),
    placeholder: "Select",
  };

  it("renders with placeholder", () => {
    render(<Select {...defaultProps} />);

    expect(screen.getByText(/Select/i)).toBeInTheDocument();
  });

  it("opens the dropdown and displays options when clicked", () => {
    render(<Select {...defaultProps} />);

    fireEvent.click(screen.getByText(/Select/i));

    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  it("calls onChange handler with the correct value when an option is selected", () => {
    render(<Select {...defaultProps} />);

    fireEvent.click(screen.getByText(/Select/i));
    fireEvent.click(screen.getByText("Option 2"));
    expect(defaultProps.onChange).toHaveBeenCalledWith({
      value: "option2",
      label: "Option 2",
    });
  });

  it("displays the selected value when passed as a prop", () => {
    render(<Select {...defaultProps} value={{ label: "Option 2", value: "option2" }} />);
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });
});
