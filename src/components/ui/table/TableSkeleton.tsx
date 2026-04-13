/** biome-ignore-all lint/suspicious/noArrayIndexKey: just a skeleton */

export type TableSkeletonProps = {
  columnsCount: number;
  actionsCount: number;
};
// Skeleton component for loading state
export const TableSkeleton = ({
  columnsCount,
  actionsCount,
}: TableSkeletonProps) => {
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
