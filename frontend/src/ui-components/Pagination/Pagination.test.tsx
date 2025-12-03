import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Pagination } from "./Pagination";
import { Sorting } from "./types";

describe("<Pagination />", () => {
  it("renders", () => {
    render(
      <Pagination
        totalRowCount={100}
        start={0}
        rowPerPage={10}
        onPageChange={(start: number) =>
          console.log(`Navigating to page ${start / 10 + 1}`)
        }
        onPageSizeChange={(size: number) =>
          console.log(`Rows per page changed to ${size}`)
        }
        onSortChange={(sorting: Sorting[]) =>
          console.log(`Sorting changed to ${sorting}`)
        }
      />,
    );
    expect(screen.getByText(/Rows/i)).toBeInTheDocument();
  });
});
