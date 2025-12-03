import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "./Switch";

describe("<Switch />", () => {
  it("renders correctly and switch toggles state", () => {
    const onChangeMock = vi.fn();

    const { rerender } = render(<Switch active={false} onChange={onChangeMock} />);

    const switchElement = screen.getByRole("switch");

    expect(switchElement).toBeInTheDocument();

    expect(switchElement).toHaveAttribute("aria-checked", "false");

    fireEvent.click(switchElement);

    rerender(<Switch id="id" active={true} onChange={onChangeMock} />);
    expect(switchElement).toHaveAttribute("aria-checked", "true");

    // expect(onChangeMock).toHaveBeenCalledWith('id' , true);

    fireEvent.click(switchElement);

    rerender(<Switch id="id" active={false} onChange={onChangeMock} />);
    expect(switchElement).toHaveAttribute("aria-checked", "false");

    // expect(onChangeMock).toHaveBeenCalledWith('id', false);
  });
});
