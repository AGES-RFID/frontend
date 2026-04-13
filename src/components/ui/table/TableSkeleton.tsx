type TableSkeletonProps = {
  columnsCount: number;
  actionsCount: number;
};

export function TableSkeleton({
  columnsCount,
  actionsCount,
}: TableSkeletonProps) {
  const rowKeys = ["row-1", "row-2", "row-3", "row-4", "row-5"];
  const columnKeys = Array.from(
    { length: columnsCount },
    (_, index) => `column-${index}`,
  );
  const actionKeys = Array.from(
    { length: actionsCount },
    (_, index) => `action-${index}`,
  );

  return (
    <tbody>
      {rowKeys.map((rowKey, rowIndex) => (
        <tr
          key={rowKey}
          className={`border-gray-200 border-b ${rowIndex === rowKeys.length - 1 ? "border-b-0" : ""}`}
        >
          {columnKeys.map((columnKey) => (
            <td
              key={columnKey}
              className="border-light-gray border-r px-4 py-3 last:border-r-0"
            >
              <div className="h-4 animate-pulse rounded bg-gray-200" />
            </td>
          ))}
          {actionsCount > 0 && (
            <td className="border-light-gray border-r px-4 py-3 last:border-r-0">
              <div className="flex space-x-2">
                {actionKeys.map((actionKey) => (
                  <div
                    key={actionKey}
                    className="h-4 w-8 animate-pulse rounded bg-gray-200"
                  />
                ))}
              </div>
            </td>
          )}
        </tr>
      ))}
    </tbody>
  );
}
