import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Menu } from "./Menu";
import { MenuUiProps } from "./types";

describe("<Menu />", () => {
  const defaultOptions = [
    {
      id: "1",
      label: "option1",
    },
    {
      id: "2",
      label: "option2",
      url: "link",
    },
    {
      id: "3",
      label: "option3",
      url: "link",
    },
    {
      id: "4",
      label: "option4",
    },
  ];

  const defaultProps: MenuUiProps = {
    options: defaultOptions,
    label: "Options",
    onMenuChange: () => {
      console.log("menu changed");
    },
  };
  it("renders with option label", () => {
    render(<Menu {...defaultProps} />);

    const optionLabel = screen.getByText("Options");
    expect(optionLabel).toBeInTheDocument();
  });

  it("renders the menu correctly and changes option when an item is clicked", () => {
    render(<Menu {...defaultProps} />);

    const menuButton = screen.getByRole("button", { name: /Options/i });
    fireEvent.click(menuButton);

    const menuItems = screen.getAllByRole("menuitem");

    expect(menuItems.length).toBe(defaultProps.options.length);

    const firstMenuItem = menuItems[0];
    fireEvent.click(firstMenuItem);
  });
});
