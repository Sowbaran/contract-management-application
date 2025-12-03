import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Permissions } from ".";

describe("<Permissions />", () => {
  it("renders", () => {
    render(
      <Permissions
        permission="viewPermission"
        children={<div>Testing Permssions</div>}
      />
    );

    expect(screen.getByText(/permissions/i)).toBeTruthy();
  });
});
