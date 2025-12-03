import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge Component", () => {
  it("render should have the required props", () => {
    render(<Badge variant="success" label="label" />);
    expect(screen.getByText(/label/i)).toBeTruthy();
  });
});
