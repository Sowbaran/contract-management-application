import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { ProfileMenu } from ".";

describe("<ProfileMenu />", () => {
  it("renders", () => {
    render(
      <ProfileMenu
        userName="profilemenu"
        handleShow={() => console.log("Showing profile")}
        handleLogoutPopup={() => console.log("Logging out")}
        handleKeyPress={(event) => console.log("Key pressed:", event.key)}
      />
    );

    expect(screen.getByText(/profilemenu/i)).toBeTruthy();
  });
});
