import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { ErrorBoundary } from ".";

describe("<ErrorBoundary />", () => {
  it("renders", () => {
    render(
      <ErrorBoundary>
        <div>error boundary</div>
      </ErrorBoundary>
    );

    expect(screen.getByText(/errorboundary/i)).toBeTruthy();
  });
});
