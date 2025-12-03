import React from "react";
import { AnyProps } from "../utils/types";
import { SelectValueProps } from "../Select/types";

export interface TableProps extends React.BaseHTMLAttributes<HTMLDivElement> , CustomTableStyles {
  prop?: string;
  fields?: FieldProps[];
  data?: AnyProps;
  header?: React.ReactNode;
  rowPerPage?: number;
  startPage?: number;
  onPageChange?: (pageNo: number, currentPage: number) => void;
  onRowPerPageChange?: (pageNo: number) => void;
  totalRowCount?: number;
  rowOptions?: SelectValueProps[];
  noRecordsJsx?:React.ReactNode;
  custNoRecordStyle?:CustomNoRecordsProps;
  currentPageStyle?: string;
  showPageInfo?: boolean;
  rowButtonStyle?: string;
  disablePagination?:boolean;
}

export interface FieldProps<T = FieldValueProp> extends CustomTableStyles {
  name: string;
  headerStyle?:string,
  cellStyle?:string,
  label?: string;
  type?: string;
  formatter?: (value: T) => React.ReactNode;
  headerFormatter?:React.ReactNode;
  headerLabelIcon?:React.ReactNode;
};

export interface CustomNoRecordsProps {
  containerStyle? : string,
  labelStyle? : string,
  label?:string,
} 

type FieldValueProp = string | number | AnyProps;

export type CustomTableStyles = {
  tableStyle? : string;
}

export interface TableHeaderProps extends React.BaseHTMLAttributes<HTMLDivElement> {}

