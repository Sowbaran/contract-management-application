import { ReactElement } from "react";

export interface DataArray {
  [key: string]: boolean | number | string | [];
}

export type FormatterFunction = (value: string) => string | ReactElement;

export type TableProps = {
  tab?: string;
  title?: string;
  description?: string;
  headerButton?:boolean;
  fields: TableFieldProps[];
  data: Partial<DataArray[]>;
  buttonComponent?: boolean;
  enableSearch?:boolean;
  enableFilter?:boolean;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  buttonActions?: any;
  pagination?: PaginationMeta;
  onPageChange?: (start: number) => void;
  onPageSizeChange?: (size: number) => void;
  onSortChange?: (sorting: Sorting[]) => void;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  onButtonClick?: (action: any, item: any) => void;
  onSearchClick?: () => void;
}

export interface TableFieldProps {
  name: string;
  label?: string;
  formatter?: FormatterFunction;
  type?: string;
  redirectBaseUrl?: string;
  headerStyle?:string,
  headerFormatter?:React.ReactNode;
}

export interface Sorting {
  id: string;
  desc: boolean;
}

export interface PaginationMeta {
  totalRowCount: number;
  start: number;
  size: number;
  sorting: Sorting[];
}
