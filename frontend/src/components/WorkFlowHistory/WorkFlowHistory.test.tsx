import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { WorkFlowHistory } from ".";

describe("<WorkFlowHistory />", () => {
  it("renders", () => {
    render(<WorkFlowHistory workflowHistory={[]} />);

    expect(screen.getByText(/workflowhistory/i)).toBeTruthy();
  });
});
