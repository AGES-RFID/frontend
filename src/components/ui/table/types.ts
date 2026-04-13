export type TableColumnValue = string | number | React.ReactNode;

export type TableColumn<
  T extends Record<string, TableColumnValue>,
  K extends keyof T = keyof T,
> = {
  key: K;
  title: string;
  render?: (value: T[K], item: T) => React.ReactNode;
  sortable?: boolean;
  nonSearchable?: boolean;
};
export type TableAction<T extends Record<string, TableColumnValue>> = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  className?: string;
};
