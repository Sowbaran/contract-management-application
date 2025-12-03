import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Dialog } from "./Dialog";
import { Default } from "./Dialog.stories";

describe("<Dialog />", () => {
  it("title and content should not be empty and at least one button should be available", () => {
    render(<Dialog {...Default.args} />);
    const titleElement = screen.getByText(Default.args.title);
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).not.toBe("");

    const contentElement = screen.getByText(Default.args.content);
    expect(contentElement).toBeTruthy();
    expect(contentElement.textContent).not.toBe("");

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});
