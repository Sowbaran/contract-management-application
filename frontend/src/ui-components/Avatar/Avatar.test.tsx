import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./Avatar";

describe("<Avatar />", () => {
  it("renders with initials", () => {
    const { getByText } = render(<Avatar initials="JD" />);
    const avatarElement = getByText("JD");
    expect(avatarElement).toBeInTheDocument();
  });

  it("renders with image", () => {
    const { getByAltText } = render(
      <Avatar src="https://example.com/avatar.jpg" alt="Avatar" />,
    );
    const avatarImage = getByAltText("Avatar");
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute("src", "https://example.com/avatar.jpg");
  });
});
