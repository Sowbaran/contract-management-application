import { forwardRef } from "react";
import { cn } from "../../utils";
import { AnyProps } from "../utils/types";
import { Pagination } from "../Pagination";
import type { FieldProps, TableHeaderProps, TableProps } from "./types";

export const Table = forwardRef<HTMLDivElement, TableProps>(
  (
    {
      className,
      data,
      fields,
      totalRowCount = 0,
      rowPerPage = 10,
      header,
      startPage = 0,
      onPageChange,
      onRowPerPageChange,
      rowOptions,
      tableStyle,
      noRecordsJsx,
      custNoRecordStyle,
      currentPageStyle="bg-green-600 text-white",
      showPageInfo = true,
      rowButtonStyle="",
      disablePagination = false,
    },
    ref,
  ) => {
    const TableCell = ({
      item,
      fieldItem,
    }: {
      item: AnyProps;
      fieldItem: FieldProps;
    }) => {
      const value = fieldItem?.type === "object" ? item : getData(item, fieldItem.name);

      return <>{fieldItem?.formatter ? fieldItem.formatter(value) : <p>{value}</p>}</>;
    };

    const getData = (object: AnyProps, path: string) => {
      return path?.split(".").reduce((obj, curr) => (obj ? obj[curr] : null), object);
    };

    return (
      <div ref={ref} className={`relative flow-root ${className}`}>
        <div className={cn(`border border-slate-200 py-2 ${!header && "bg-gray-50 py-[2px]"} rounded-md  align-middle  w-full`)}>
          {header}
          <div className="overflow-x-auto w-full">
            <table
              className={cn(
                "min-w-[700px] p-1 divide-y divide-slate-200 w-full",
                tableStyle,
              )}
            >
              <thead className={cn(`bg-gray-50 border-y ${!header && "border-t-0"} border-slate-200`)}>
                <tr>
                  {fields?.map((field, index) =>
                    field.headerFormatter ? (
                      <th className={field.headerStyle} key={field.name}>
                        {field.headerFormatter}
                      </th>
                    ) : (
                      <th
                        className={cn(
                          `font-medium  py-3 text-left text-[12px] text-slate-400 ${
                            index === 0 ? "pl-4" : "pl-6"
                          } ${field.headerStyle}`,
                        )}
                        key={field.name}
                      >
                        <div className="flex flex-row gap-1">
                        <p>{field.label}</p>
                        {field.headerLabelIcon}
                        </div>
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {data?.map((tableRow: AnyProps, rowIndex: number) => (
                  <tr key={`${rowIndex}-${Date.now()}`}>
                    {fields?.map((field: FieldProps, rowIndex) => (
                      <td
                        className={cn(
                          `py-3.5  ${
                            rowIndex === 0 ? "pl-5" : "pl-6"
                          } text-left text-sm font-medium text-gray-600 ${
                            field.cellStyle
                          }`,
                        )}
                        key={`${field.name}-${rowIndex}`}
                      >
                        <TableCell item={tableRow} fieldItem={field} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {data?.length <= 0 &&((noRecordsJsx) || (
              <div className={cn("flex justify-center  mt-2" , custNoRecordStyle?.containerStyle)}>
                <p className={cn("text-gray-400/60 font-normal", custNoRecordStyle?.labelStyle)}> {`${custNoRecordStyle?.label || "No Records Found"}`}</p>
              </div>
            ))}
          </div>
        </div>
        {
          !disablePagination &&
          <Pagination
            totalRowCount={totalRowCount}
            start={startPage}
            rowPerPage={rowPerPage}
            onPageChange={onPageChange || (() => {})}
            onPageSizeChange={onRowPerPageChange || (() => {})}
            rowOptions={rowOptions}
            currentPageStyle={currentPageStyle}
            showPageInfo={showPageInfo}
            rowButtonStyle={rowButtonStyle}
          />
        }
      </div>
    );
  },
);

export const TableHeader = ({ children, className }: TableHeaderProps) => {
  const containerStyle = "flex w-full items-center justify-center gap-3 my-4";

  const clsxMerge = cn(containerStyle, className);

  return <div className={clsxMerge}>{children}</div>;
};
