import type { ReactNode } from "react";

export type TableColumn<
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  key: keyof T;
  title: string;
  render?: (value: T[keyof T], item: T) => ReactNode;
  sortable?: boolean;
  className?: string;
};

export type TableAction<
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  key: string;
  label: string;
  icon?: ReactNode;
  onClick: (item: T) => void;
  className?: string;
  show?: (item: T) => boolean;
};

export type TableProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  loading?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  searchNotFoundMessage?: string;
  className?: string;
  searchable?: boolean;
  searchBarComponent?: ReactNode;
  paginationPageSize?: number;
  onRowClick?: (item: T) => void;
  rowClassName?: string;
};

export type SortDirection = "asc" | "desc";

export type SortConfig<T> = {
  key: keyof T;
  direction: SortDirection;
};
