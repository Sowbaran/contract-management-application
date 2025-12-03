import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Checkbox } from ".";

describe("<Check />", () => {
  it("renders", () => {
    render(<Checkbox label="Default" />);
    expect(screen.getByText(/default/i)).toBeTruthy();
  });
});
