import { SelectValueProps } from "../Select/types";

export type PaginationProps = {
  totalRowCount: number;
  start: number;
  rowPerPage: number;
  sorting?: Sorting[];
  onPageChange: (start: number, currentPage: number) => void;
  onPageSizeChange: (size: number) => void;
  onSortChange?: (sorting: Sorting[]) => void;
  currentPageStyle?: string;
  rowButtonStyle?: string;
  rowOptions?: SelectValueProps[];
  showPageInfo?: boolean;
};

export interface PaginationMeta {
  totalRowCount: number;
  start: number;
  size: number;
  sorting?: Sorting[];
}

export interface Sorting {
  id: string;
  desc: boolean;
}
