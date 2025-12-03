import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Link } from "./Link";

describe("<Link />", () => {
  it("renders the default link", () => {
    render(<Link href="#">Default Link</Link>);
    const linkElement = screen.getByText(/Default Link/i);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "#");
  });

  it("renders the external link", () => {
    render(
      <Link href="https://example.com" target="_blank" rel="noopener noreferrer">
        External Link
      </Link>,
    );
    const linkElement = screen.getByText(/External Link/i);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "https://example.com");
    expect(linkElement).toHaveAttribute("target", "_blank");
    expect(linkElement).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("applies custom class for button style", () => {
    render(
      <Link href="#" className="btn btn-primary">
        Button Link
      </Link>,
    );
    const linkElement = screen.getByText(/Button Link/i);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveClass("btn btn-primary");
  });

  it("forwards refs correctly", () => {
    const ref = { current: null } as React.RefObject<HTMLAnchorElement>;
    render(
      <Link href="#" ref={ref}>
        Ref Link
      </Link>,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    expect(ref.current?.getAttribute("href")).toBe("#");
  });
});
