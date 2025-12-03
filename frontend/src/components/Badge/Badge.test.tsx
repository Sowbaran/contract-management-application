import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
 
import { BadgeComponent } from ".";
 
describe("<Badge />", () => {
  it("renders", () => {
    render(<BadgeComponent value="Badge" />);
 
    expect(screen.getByText(/badge/i)).toBeTruthy();
  });
});