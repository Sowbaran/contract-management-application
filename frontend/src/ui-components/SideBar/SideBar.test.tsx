import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SideBar } from "./SideBar";

import { mainList } from "./data";

describe("<SideBar />", () => {
  it("renders", () => {
    render(<SideBar mainContents={mainList} />);

    const buttonItems = screen.getAllByRole("button");
    fireEvent.mouseOver(buttonItems[0]);

    expect(screen.getByText(/Home/i)).toBeInTheDocument();

    fireEvent.mouseOver(buttonItems[1]);

    expect(screen.getByText(/Users/i)).toBeInTheDocument();

    fireEvent.mouseLeave(buttonItems[1]);
  });
});
