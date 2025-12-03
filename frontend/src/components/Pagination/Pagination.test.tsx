import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Pagination } from ".";
import { Sorting } from "./types";

describe("<Pagination />", () => {
  it("renders", () => {
    render(
      <Pagination
        totalRowCount={100}
        start={0}
        size={10}
        onPageChange={(start: number) =>
          console.log(`Navigating to page ${start / 10 + 1}`)
        }
        onPageSizeChange={(size: number) =>
          console.log(`Rows per page changed to ${size}`)
        }
        onSortChange={(sorting: Sorting[]) =>
          console.log(`Sorting changed to ${sorting}`)
        }
      />
    );

    // Look for a different role
    expect(screen.getByRole("navigation")).toBeTruthy();
  });
});
