import { Link } from "@tanstack/react-router";
import { Pagination } from "../Pagination";
import { Sorting } from "../Pagination/types";
import type { TableProps } from "./types";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { cn } from "../../utils";

export const Table: React.FC<TableProps> = ({
  tab,
  title,
  description,
  fields,
  data,
  buttonComponent,
  buttonActions,
  pagination,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onButtonClick,
  onSearchClick,
}) => {
  const handlePageChange = (start: number) => {
    if (onPageChange) {
      onPageChange(start);
    }
  };

  const handlePageSizeChange = (size: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(size);
    }
  };

  const handleSortChange = (sorting: Sorting[]) => {
    if (onSortChange) {
      onSortChange(sorting);
    }
  };

  interface ActionButtonProps {
    name: string;
  }

  interface TableCellProps {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    item: any;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    field: any;
  }

  const TableCell: React.FC<TableCellProps> = ({ item, field }) => {
    const value = getValueByPath(item, field.name);
    if (field.type === "link") {
      return (
        <Link
          to={`${field.redirectBaseUrl}/detail/${item?._id}`}
          search={{ page: tab, moduleId: item?.moduleId }}
          className="text-blue-500 font-medium underline-none cursor-pointer"
        >
          {value}
        </Link>
      );
    } 
    if(field.type === "boolean"){
      return (value ? "Yes" : "No");
    }
    return field.formatter ? field.formatter(value) : value;
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const getValueByPath = (object: any, path: string) => {
    return path.split(".").reduce((o, p) => (o ? o[p] : null), object);
  };

  const pathParts = window.location.pathname.split("/");
  
  return (
    <>
      <div className="px-2 sm:px-3 lg:px-4">
        
        {title && description && (
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900">
                {title}
              </h1>
              {pathParts[1] === 'finance' && pathParts[2] === 'vendor-contract' && pathParts[3] === 'configurations' ? (
                <div className="mt-2 text-sm text-gray-700">
                  {description && (
                    <div className="min-w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-4">
                      <div className="px-6 py-4">
                        <h2 className="text-l font-semibold text-gray-800">Notes: Approver inclusion logic</h2>
                        <div className="mt-4">
                          {description.split('\n').map((line, index) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                              <p key={index} className="mt-2 text-sm text-gray-700">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) :  <p className="mt-2 text-sm text-gray-700">{description}</p>}
            </div>
          </div>
        )}

        <div className="mt-2">
            {
            false &&
            <div className="flex justify-end  mr-6 mb-1">
              <div className="flex border min-w-[280px] border-gray-300 rounded-md">
                <input placeholder="Search" className="w-[80%] block flex-1 rounded-md border-0 bg-white py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:border-transparent focus:outline-none sm:text-sm sm:leading-6" />
                <button type="button" className="flex justify-center items-center w-[15%] bg-green-600 rounded-r-md hover:bg-green-400" onClick={onSearchClick}>
                  <MagnifyingGlassIcon className="w-6 h-6 fill-white" />
                </button>
              </div>
            </div>
          }
        <div className="overflow-x-auto flow-root">
          <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full border-separate border-spacing-0">
                <thead className="bg-gray-50">
                  <tr>
                    {fields.map((field, fieldIndex) => (
                      field.headerFormatter ? (
                        <th className={cn(`sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8 ${field.headerStyle}`)} scope="col" key={field.name}>
                          {field.headerFormatter}
                        </th>
                      ) :
                      <th
                        key={`${field.name}-${fieldIndex}-${Date.now()}`}
                        scope="col"
                        className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                      >
                        {field.label}
                      </th>
                    ))}
                    {buttonComponent && buttonActions?.map((action: { name: string; }, actionIndex: number) => (
                        <th
                          key={`${action.name}-${actionIndex}-${Date.now()}`}
                          scope="col"
                          className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                        />
                      ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((tableRow, rowIndex) => (
                    <tr key={`${rowIndex}-${Date.now()}`}>
                      {fields.map((field) => (
                        <td
                          key={`${field.name}-${field.label}-${rowIndex}`}
                          className={
                            "border-b border-gray-200 whitespace-nowrap py-4 pl-4 pr-3 text-sm font-normal text-gray-900 sm:pl-6 lg:pl-8"
                          }
                        >
                          <TableCell item={tableRow} field={field} />
                        </td>
                      ))}
                      {buttonComponent &&
                        buttonActions?.map(
                          (actionButtons: ActionButtonProps, actionIndex: number) => (
                            <td
                              key={`${actionButtons.name}-${actionIndex}-${rowIndex}-${Date.now()}`}
                              className="border-b border-gray-200 px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                            >
                              <button
                                type="button"
                                className="px-4 py-1 text-sm font-medium text-green-600 transition-colors duration-300 border-2 border-green-600 rounded-md hover:bg-green-600 hover:text-white"
                                style={{ borderColor: "#00CF5D" }}
                                onClick={() =>
                                  onButtonClick?.(actionButtons, tableRow)
                                }
                              >
                                {actionButtons.name}
                              </button>
                            </td>
                          )
                        )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </div>
      </div>

      {pagination && (
        <Pagination
          totalRowCount={pagination.totalRowCount}
          start={pagination.start}
          size={pagination.size}
          sorting={pagination.sorting}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSortChange={handleSortChange}
        />
      )}
      {buttonComponent && (
        <div className="mt-4">{/* Render your button component here */}</div>
      )}
    </>
  );
};
