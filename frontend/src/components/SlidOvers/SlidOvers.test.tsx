import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { SlidOvers } from ".";

describe("<SlidOvers />", () => {
  it("renders", () => {
    const mockOnClose = vi.fn();
    render(
      <SlidOvers
        heading="slid-overs"
        children={<div>Slideover Content</div>}
        isOpen={false}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText(/slidovers/i)).toBeTruthy();
  });
});
