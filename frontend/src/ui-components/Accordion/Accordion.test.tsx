import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Accordion } from ".";

describe("<Accordion />", () => {
  it("renders title visible content not visible", () => {
    render(
      <Accordion openId="1" headerLabel="header">
        <div>content</div>
      </Accordion>,
    );
    expect(screen.getByText(/header/i)).toBeInTheDocument();
  });

  it("opens the accordion if openId matches selectedId on mount", () => {
    render(
      <Accordion openId="1" headerLabel="header" selectedId="1">
        <div>content</div>
      </Accordion>,
    );
    const buttonItem = screen.getByRole("button", { name: /header/i });

    expect(screen.getByText(/content/i)).toBeInTheDocument();

    fireEvent.click(buttonItem);

    expect(screen.queryByText(/content/i)).not.toBeInTheDocument();
  });
});
