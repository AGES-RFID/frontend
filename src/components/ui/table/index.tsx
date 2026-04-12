import { useState, useMemo } from "react";
import { Search } from "lucide-react";

// Type definitions for the table component
export type TableColumn<T = any> = {
  key: keyof T;
  title: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
};

export type TableAction<T = any> = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  className?: string;
};

type TableProps<T = any> = {
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

// Skeleton component for loading state
const TableSkeleton = ({
  columnsCount,
  actionsCount,
}: {
  columnsCount: number;
  actionsCount: number;
}) => {
  return (
    <tbody>
      {[...Array(5)].map((_, index) => (
        <tr
          key={index}
          className={`border-gray-200 border-b ${index === 4 ? "border-b-0" : ""}`}
        >
          {[...Array(columnsCount)].map((_, colIndex) => (
            <td
              key={colIndex}
              className="border-light-gray border-r px-4 py-3 last:border-r-0"
            >
              <div className="h-4 animate-pulse rounded bg-gray-200"></div>
            </td>
          ))}
          {actionsCount > 0 && (
            <td className="border-light-gray border-r px-4 py-3 last:border-r-0">
              <div className="flex space-x-2">
                {[...Array(actionsCount)].map((_, actionIndex) => (
                  <div
                    key={actionIndex}
                    className="h-4 w-8 animate-pulse rounded bg-gray-200"
                  ></div>
                ))}
              </div>
            </td>
          )}
        </tr>
      ))}
    </tbody>
  );
};

// Function to highlight search matches
const highlightText = (text: string, searchTerm: string) => {
  if (!searchTerm) return text;

  const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <span key={index} className="font-bold">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
};

export function Table<T extends Record<string, any>>({
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
}: TableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter data based on search term across all fields
  const filteredData = useMemo(() => {
    if (!searchTerm || !searchable) return data;

    const searchLower = searchTerm.toLowerCase();

    return data.filter((item) => {
      // Search through all column values
      return columns.some((column) => {
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
    if (searchTerm && searchable) {
      return highlightText(String(value || ""), searchTerm);
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
              <Search
                className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:outline-none"
              />
            </div>
            {searchBarComponent && (
              <div className="flex-shrink-0">{searchBarComponent}</div>
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
