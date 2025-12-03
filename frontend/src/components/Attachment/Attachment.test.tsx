import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Attachment } from ".";

describe("<Attachment />", () => {
  it("renders", () => {
    render(<Attachment name="attachment" />);

    expect(screen.getByText(/attachment/i)).toBeTruthy();
  });
});
