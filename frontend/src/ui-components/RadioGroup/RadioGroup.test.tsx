import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RadioGroup, RadioGroupItem } from "./RadioGroup";

describe("RadioGroup Component", () => {
  it("renders RadioGroup with default options", () => {
    render(
      <RadioGroup
      >
        <RadioGroupItem name="" value="option1" description={""}>
          Option 1
        </RadioGroupItem>
        <RadioGroupItem name=""  value="option2" description={""}>
          Option 2
        </RadioGroupItem>
        <RadioGroupItem  name="" value="option3" description={""}>
          Option 3
        </RadioGroupItem>
      </RadioGroup>,
    );

    const option1Radio = screen.getByLabelText("Option 1");
    const option2Radio = screen.getByLabelText("Option 2");
    const option3Radio = screen.getByLabelText("Option 3");

    expect(option1Radio).toBeInTheDocument();
    expect(option2Radio).toBeInTheDocument();
    expect(option3Radio).toBeInTheDocument();
  });
});
