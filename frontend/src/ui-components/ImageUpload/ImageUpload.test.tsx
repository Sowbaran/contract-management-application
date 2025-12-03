import { render } from "@testing-library/react";
import { describe, it, vi } from "vitest";

import { ImageUpload } from "./ImageUpload";

vi.mock("filepond-plugin-file-poster", () => {
  return {
    default: () => {},
  };
});

describe("<ImageUpload />", () => {
  it("renders", () => {
    render(<ImageUpload label="Image" />);
  });
});
