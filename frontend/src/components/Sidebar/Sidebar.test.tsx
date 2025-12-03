import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Sidebar } from ".";

describe("<Sidebar />", () => {
  it("renders", () => {
    render(
      <Sidebar
        items={[]}
        userPermissions={[]}
        sidebarOpen={true}
        setSidebarOpen={(open) => console.log("Sidebar open:", open)}
        userName={"John Doe"}
        handleShow={() => console.log("Showing profile")}
        handleLogoutPopup={() => console.log("Logging out")}
        handleKeyPress={(event) => console.log("Key pressed:", event.key)}
      />
    );

    expect(true).toBeTruthy();
  });
});
