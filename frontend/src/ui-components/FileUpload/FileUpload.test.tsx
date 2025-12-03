import { render } from "@testing-library/react";
import { describe, it } from "vitest";

import { FileUpload } from ".";

describe("<FileUpload />", () => {
  it("renders", () => {
    render(<FileUpload />);
  });
});
