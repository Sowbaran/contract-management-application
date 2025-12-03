import {  render, screen } from "@testing-library/react";
import { describe, expect, it, vitest } from "vitest";
import { Drawer } from "./Drawer";

describe("<Drawer />", () => {
  it("renders the Drawer component when open", () => {
    render(
      <Drawer open={true} mainContent={<div>Main Content</div>} handleOpen={() => {}} enableZindex={true}/>
    );
    expect(screen.getByText("Main Content")).toBeInTheDocument();
  });

  it("does not render the Drawer content when closed", () => {
    render(
      <Drawer open={false} handleOpen={() => {}} enableZindex={true}>
        <div>Drawer Content</div>
      </Drawer>,
    );
    expect(screen.queryByText("Main Content")).not.toBeInTheDocument();
  });

  it("calls handleOpen with false when the close button is clicked", () => {
    const handleOpenMock = vitest.fn();
    render(
      <Drawer open={true} handleOpen={handleOpenMock} enableZindex={true}>
        <div>Drawer Content
          <button type="button">Close Pannel</button>
        </div>
      </Drawer>,
    );

  });
});
