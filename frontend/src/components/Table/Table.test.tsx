import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Table } from ".";

describe("<Table />", () => {
  it("renders", () => {
    render(
      <Table
        fields={[]}
        data={[]}
        buttonComponent={true}
        title=""
        description=""
      />
    );
    expect(screen.getByText(/table/i)).toBeTruthy();
  });
});
