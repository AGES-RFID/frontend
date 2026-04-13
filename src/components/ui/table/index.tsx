import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "../input";
import { HighlightText } from "./HighlightText";
import { TableSkeleton } from "./TableSkeleton";
import type { TableAction, TableColumn, TableColumnValue } from "./types";
import { canSearchColumn } from "./utils";

type TableProps<T extends Record<string, TableColumnValue>> = {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  loading?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  searchNotFoundMessage?: string;
  className?: string;
  searchable?: boolean;
  searchBarComponent?: React.ReactNode;
};

export function Table<T extends Record<string, TableColumnValue>>({
  data,
  columns,
  actions = [],
  loading = false,
  searchPlaceholder = "Pesquisar...",
  emptyMessage = "Nenhum dado encontrado.",
  searchNotFoundMessage = "Nenhum resultado encontrado para esta busca.",
  className,
  searchable = true,
  searchBarComponent,
}: TableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter data based on search term across all fields
  const filteredData = useMemo(() => {
    if (!searchTerm || !searchable) return data;

    const searchLower = searchTerm.toLowerCase();

    return data.filter((item) => {
      return columns.filter(canSearchColumn).some((column) => {
        const value = item[column.key];
        if (value === null || value === undefined) return false;
        const stringValue = String(value);
        return stringValue.toLowerCase().includes(searchLower);
      });
    });
  }, [data, columns, searchTerm, searchable]);

  // Function to render cell content
  const renderCell = (column: TableColumn<T>, item: T) => {
    const value = item[column.key];

    if (column.render) {
      return column.render(value, item);
    }

    // Apply highlighting if search is active
    if (canSearchColumn(column)) {
      return (
        <HighlightText text={String(value) || ""} searchTerm={searchTerm} />
      );
    }

    return value || "-";
  };

  const totalColumns = columns.length + (actions.length > 0 ? 1 : 0);

  return (
    <div className={className}>
      {/* Search Bar */}
      {searchable && (
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Input
                leftDecoration={<Search size={16} className="text-gray" />}
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {searchBarComponent && (
              <div className="flex shrink-0">{searchBarComponent}</div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-light-gray">
        <table className="min-w-full">
          <thead>
            <tr className="bg-dark-blue text-white">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="border-light-gray border-r px-4 py-3 text-left font-medium last:border-r-0"
                >
                  {column.title}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-4 py-3 text-left font-medium">Ações</th>
              )}
            </tr>
          </thead>

          {loading ? (
            <TableSkeleton
              columnsCount={columns.length}
              actionsCount={actions.length}
            />
          ) : (
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={totalColumns}
                    className="py-12 text-center text-gray"
                  >
                    {searchTerm ? searchNotFoundMessage : emptyMessage}
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr
                    // biome-ignore lint/suspicious/noArrayIndexKey: a
                    key={index}
                    className={`border-light-gray border-b ${index === filteredData.length - 1 ? "border-b-0" : ""}`}
                  >
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className="border-light-gray border-r px-4 py-3 last:border-r-0"
                      >
                        {renderCell(column, item)}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          {actions.map((action) => (
                            <button
                              type="button"
                              key={action.key}
                              onClick={() => action.onClick(item)}
                              className={
                                action.className ||
                                "text-dark-blue transition-colors hover:text-dark-blue"
                              }
                              title={action.label}
                            >
                              {action.icon || action.label}
                            </button>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
