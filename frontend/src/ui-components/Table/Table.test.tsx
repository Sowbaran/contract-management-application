import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";

import { Table } from ".";
import { FieldProps } from "./types";

const fields: FieldProps[] = [
  {
    name: "name",
    label: "Name",
  },
  {
    name: "date",
    label: "Date",
  },
];

describe("<Table />", () => {
  it("renders", () => {
    render(<Table header={<div>Header</div>} fields={fields} prop="tablenew" />);
    expect(screen.getByText(/Name/i)).toBeTruthy();
  });
});
