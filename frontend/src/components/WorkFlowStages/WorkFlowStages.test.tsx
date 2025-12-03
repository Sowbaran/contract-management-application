import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { WorkFlowStages } from ".";

describe("<WorkFlowStages />", () => {
  it("renders", () => {
    render(<WorkFlowStages steps={[]} />);

    expect(screen.getByText(/workflowstages/i)).toBeTruthy();
  });
});
