import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Loader } from ".";

describe("<Loader />", () => {
  it("renders", () => {
    render(<Loader />);

    expect(screen.getByText(/loader/i)).toBeTruthy();
  });
});
