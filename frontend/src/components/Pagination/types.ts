export type PaginationProps = {
  pagination: PaginationMeta;
  onPageChange: (start: number) => void;
  onPageSizeChange: (size: number) => void;
  onSortChange?: (sorting: Sorting[]) => void;
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
