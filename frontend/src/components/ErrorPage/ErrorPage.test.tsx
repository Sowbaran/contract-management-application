import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { ErrorPage } from ".";

describe("<ErrorPage />", () => {
  it("renders", () => {
    render(<ErrorPage message="Error: Page not found" />);

    expect(screen.getByText(/errorpage/i)).toBeTruthy();
  });
});
