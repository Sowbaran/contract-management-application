import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "./Button";

describe("<ButtonNew />", () => {
  it("renders", () => {
    render(<Button label="Button" />);

    expect(screen.getByText(/Button/i)).toBeTruthy();
  });
});
