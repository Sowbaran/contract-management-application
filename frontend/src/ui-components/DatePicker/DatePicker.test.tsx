import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DatePickerComponent } from ".";

describe("<DatePicker />", () => {
  it("renders", () => {
    render(<DatePickerComponent calendarType={"DatePicker"} />);

    expect(true).toBeTruthy();
  });
});
