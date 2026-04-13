import type { TableColumn, TableColumnValue } from "./types";

export function canSearchColumn<T extends Record<string, TableColumnValue>>(
  column: TableColumn<T>,
): boolean {
  return !column.nonSearchable && !column.render;
}
