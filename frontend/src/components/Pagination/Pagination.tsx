import React, { FC } from "react";
import { PaginationMeta, Sorting } from "./types";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface PaginationProps extends PaginationMeta {
  onPageChange: (start: number) => void;
  onPageSizeChange: (size: number) => void;
  onSortChange: (sorting: Sorting[]) => void;
}

export const Pagination: FC<PaginationProps> = ({
  totalRowCount,
  start,
  size,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages =
    totalRowCount > 0 && size > 0 ? Math.ceil(totalRowCount / size) : 0;
  const currentPage = Math.floor(start / size) + 1;

  const startRecord = (currentPage - 1) * size + 1;
  let endRecord = currentPage * size;
  if (endRecord > totalRowCount) {
    endRecord = totalRowCount;
  }

  const handlePageChange = (newPage: number) => {
    const newStart = (newPage - 1) * size;
    onPageChange(newStart);
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newSize = parseInt(event.target.value, 10);
    onPageSizeChange(newSize);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbers = 3;

    let startPage = Math.max(currentPage - Math.floor(maxPageNumbers / 2), 1);
    const endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

    if (endPage - startPage + 1 < maxPageNumbers) {
      startPage = Math.max(endPage - maxPageNumbers + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          type="button"
          key={i}
          className={`mx-1 px-3 py-1 rounded ${
            i === currentPage
              ? "bg-green-400 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center">
        <span className="mr-2">Rows per page:</span>
        <select
          value={size}
          onChange={handlePageSizeChange}
          className="ml-2 border border-gray-300 rounded px-2 py-1"
        >
          <option className="bg-white text-gray-900" value={10}>
            10
          </option>
          <option className="bg-white text-gray-900" value={20}>
            20
          </option>
          <option className="bg-white text-gray-900" value={50}>
            50
          </option>
        </select>
      </div>
      <div className="flex items-center">
        <span>
          Showing {startRecord}-{endRecord} of {totalRowCount}{" "}
        </span>
        <button
          type="button"
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 mx-2 disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <ChevronLeftIcon className="h-5 w-5 text-md" />
        </button>
        {renderPageNumbers()}
        <button
          type="button"
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 ml-2 disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <ChevronRightIcon className="h-5 w-5 text-md" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
