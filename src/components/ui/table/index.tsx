import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { HighlightText } from "./HighlightText";
import { TableSkeleton } from "./TableSkeleton";
import { compareTableValues, formatTableCellValue } from "./utils";
import type { SortConfig, TableColumn, TableProps } from "./types";

export type { TableAction, TableColumn, TableProps, SortConfig } from "./types";

export function Table<T extends Record<string, unknown>>({
  data,
  columns,
  actions = [],
  loading = false,
  searchPlaceholder = "Pesquisar...",
  emptyMessage = "Nenhum dado encontrado.",
  searchNotFoundMessage = "Nenhum resultado encontrado para esta busca.",
  className = "",
  searchable = true,
  searchBarComponent,
  paginationPageSize,
  onRowClick,
  rowClassName = "",
}: TableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(null);

  const filteredData = useMemo(() => {
    if (!searchTerm || !searchable) return data;

    const searchLower = searchTerm.toLowerCase();

    return data.filter((item) =>
      columns.some((column) => {
        const value = item[column.key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchLower);
      }),
    );
  }, [data, columns, searchTerm, searchable]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    const sorted = [...filteredData];
    sorted.sort((leftItem, rightItem) => {
      const leftValue = leftItem[sortConfig.key];
      const rightValue = rightItem[sortConfig.key];

      return compareTableValues(leftValue, rightValue, sortConfig.direction);
    });

    return sorted;
  }, [filteredData, sortConfig]);

  const pageSize =
    paginationPageSize && paginationPageSize > 0
      ? paginationPageSize
      : undefined;
  const totalPages = pageSize
    ? Math.max(1, Math.ceil(sortedData.length / pageSize))
    : 1;

  const paginatedData = useMemo(() => {
    if (!pageSize) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [currentPage, pageSize, sortedData]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const renderCell = (column: TableColumn<T>, item: T) => {
    const value = item[column.key];

    if (column.render) {
      return column.render(value, item);
    }

    if (searchTerm && searchable) {
      return (
        <HighlightText
          text={formatTableCellValue(value)}
          searchTerm={searchTerm}
        />
      );
    }

    return formatTableCellValue(value);
  };

  const totalColumns = columns.length + (actions.length > 0 ? 1 : 0);

  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable) return;

    setSortConfig((currentSort) => {
      if (currentSort?.key === column.key) {
        return {
          key: column.key,
          direction: currentSort.direction === "asc" ? "desc" : "asc",
        };
      }

      return {
        key: column.key,
        direction: "asc",
      };
    });
  };

  const getSortIndicator = (column: TableColumn<T>) => {
    if (!sortConfig || sortConfig.key !== column.key) {
      return "↕";
    }

    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  return (
    <div className={className}>
      {searchable && (
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:outline-none"
              />
            </div>
            {searchBarComponent && (
              <div className="shrink-0">{searchBarComponent}</div>
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-light-gray">
        <table className="min-w-full">
          <thead>
            <tr className="bg-dark-blue text-white">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`border-light-gray border-r px-4 py-3 text-left font-medium last:border-r-0 ${column.className || ""} ${column.sortable ? "cursor-pointer select-none" : ""}`}
                  onClick={
                    column.sortable ? () => handleSort(column) : undefined
                  }
                  scope="col"
                >
                  <span className="flex items-center gap-2">
                    <span>{column.title}</span>
                    {column.sortable ? (
                      <span
                        className="text-white/80 text-xs"
                        aria-hidden="true"
                      >
                        {getSortIndicator(column)}
                      </span>
                    ) : null}
                  </span>
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
                paginatedData.map((item, index) => (
                  <tr
                    key={JSON.stringify(item)}
                    className={`border-light-gray border-b ${index === paginatedData.length - 1 ? "border-b-0" : ""} ${onRowClick ? "cursor-pointer transition-colors hover:bg-light-gray/30" : ""} ${rowClassName}`}
                    onClick={onRowClick ? () => onRowClick(item) : undefined}
                    role={onRowClick ? "button" : undefined}
                    tabIndex={onRowClick ? 0 : undefined}
                    onKeyDown={
                      onRowClick
                        ? (event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              onRowClick(item);
                            }
                          }
                        : undefined
                    }
                  >
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={`border-light-gray border-r px-4 py-3 last:border-r-0 ${column.className || ""}`}
                      >
                        {renderCell(column, item)}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          {actions.map((action) => {
                            if (action.show && !action.show(item)) return null;

                            return (
                              <button
                                key={action.key}
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  action.onClick(item);
                                }}
                                className={
                                  action.className ||
                                  "text-dark-blue transition-colors hover:text-dark-blue"
                                }
                                title={action.label}
                              >
                                {action.icon || action.label}
                              </button>
                            );
                          })}
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

      {pageSize && filteredData.length > 0 && (
        <div className="mt-4 flex items-center justify-between gap-4 text-gray text-sm">
          <span>
            Mostrando{" "}
            {Math.min((currentPage - 1) * pageSize + 1, filteredData.length)}-
            {Math.min(currentPage * pageSize, filteredData.length)} de{" "}
            {filteredData.length}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-md border border-light-gray px-3 py-2 text-dark-gray transition-colors hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage <= 1}
            >
              Anterior
            </button>
            <span className="min-w-20 text-center font-medium text-dark-gray">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              className="rounded-md border border-light-gray px-3 py-2 text-dark-gray transition-colors hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage >= totalPages}
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
