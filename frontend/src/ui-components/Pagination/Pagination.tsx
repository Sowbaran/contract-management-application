import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import { FC, useMemo } from "react";
import { Button } from "../Button";
import { Select } from "../Select";
import { PaginationProps } from "./types";

export const Pagination: FC<PaginationProps> = ({
  totalRowCount,
  start,
  rowPerPage,
  showPageInfo = true,
  onPageChange,
  onPageSizeChange,
  rowOptions = [{ label: "", value: "" }],
  ...props
}) => {
  const totalPages =
    totalRowCount > 0 && rowPerPage > 0 ? Math.ceil(totalRowCount / rowPerPage) : 0;
  const currentPage = Math.floor(start / rowPerPage) + 1;

  let endRecord = currentPage * rowPerPage;
  if (endRecord > totalRowCount) {
    endRecord = totalRowCount;
  }

  // Memoize filtered options to prevent creating new array on every render
  const filteredRowOptions = useMemo(
    () => rowOptions.filter(it => Number.parseInt(it.value) <= totalRowCount),
    [rowOptions, totalRowCount]
  );

  const handlePageChange = (newPage: number) => {
    const newStart = (newPage - 1) * rowPerPage;
    onPageChange(newStart, newPage);
  };

  const handlePageSizeChange = (value: string) => {
    const newSize = Number.parseInt(value, 10);
    onPageSizeChange(newSize);
  };

  const renderPageNumbers = () => {
    const firstPageNumbers = [];
    const pageNumbers = [];
    const lastPageNumbers = [];
    const firstDotPhase = 4;
    let maxPageNumbers = 3;

    let startPage = 0;
    let endPage = 0;

    if (totalPages > 7) {
      if (currentPage === firstDotPhase - 1) {
        maxPageNumbers = 4;
      }
      if (currentPage >= totalPages - (maxPageNumbers - 1)) {
        startPage = totalPages - maxPageNumbers;
        maxPageNumbers = 4;
        endPage = totalPages;
      } else {
        startPage = Math.max(currentPage - Math.floor(maxPageNumbers / 2), 1);
        endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);

        if (endPage - startPage + 1 < maxPageNumbers) {
          startPage = Math.max(endPage - maxPageNumbers + 1, 1);
        }
      }
    } else {
      startPage = 1;
      endPage = totalPages;
    }

    const getButton = (i: number) => {
      return (
        <button
          type="button"
          key={i}
          className={`w-10 h-10 rounded ${
            i === currentPage
              ? props?.currentPageStyle || "bg-primary-100 text-primary-600"
              : "text-gray-500"
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    };

    if (currentPage >= firstDotPhase) {
      firstPageNumbers.push(getButton(1));
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(getButton(i));
    }

    if (currentPage < totalPages) {
      lastPageNumbers.push(getButton(totalPages));
    }

    return (
      <div className="flex items-end font-semibold">
        {totalPages > 7 && currentPage >= firstDotPhase && (
          <>
            {firstPageNumbers}
            <span className="mb-1 mx-4">...</span>{" "}
          </>
        )}
        {pageNumbers}
        {totalPages > 7 && currentPage < totalPages - (maxPageNumbers - 1) && (
          <>
            <span className="mb-1 mx-4">...</span> {lastPageNumbers}{" "}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-4 m-1 gap-2">
      <div className="flex items-center">
        <div className="hidden sm:flex items-center mb-2">
          <span className="mr-2 text-sm font-semibold">Rows:</span>
          <Select
            size="sm"
            options={filteredRowOptions}
            value={{ label: rowPerPage.toString(), value: rowPerPage.toString() }}
            className="min-w-[60px]"
            buttonStyle={`${props?.rowButtonStyle}`}
            placeholder=""
            onChange={item => handlePageSizeChange(item.value)}
          />

          {showPageInfo && (
            <div className="text-sm italic text-gray-700 ml-5">
              Showing{" "}
              <span className="text-sm font-semibold text-gray-900">
                {Math.min((currentPage - 1) * rowPerPage + 1, totalRowCount)}
              </span>{" "}
              to{" "}
              <span className="text-sm font-semibold text-gray-900">
                {Math.min(currentPage * rowPerPage, totalRowCount)}
              </span>{" "}
              of{" "}
              <span className="text-sm font-semibold text-gray-900">{totalRowCount}</span>{" "}
              results
            </div>
          )}
        </div>
      </div>
      <div className="hidden md:block">{renderPageNumbers()}</div>

      <div className="flex items-center gap-2">
        <Button
          label="Previous"
          variant="greenOutline"
          size="sm"
          leftIcon={<ArrowLeftIcon className="w-4 h-4" />}
          type="button"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        />
        <Button
          label="Next"
          type="button"
          variant="green"
          size="sm"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => handlePageChange(currentPage + 1)}
          rightIcon={<ArrowRightIcon className="w-4 h-4" />}
        />
      </div>
    </div>
  );
};
