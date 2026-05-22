import { useState } from "react";
import { Table } from "@/components/ui/table";
import { formatPlate, formatPermanenceTime } from "@/utils/formatting";
import type { PermanenceDto } from "../dtos/permanenceDto";

interface PermanenceTableProps {
  vehicles: (PermanenceDto & Record<string, unknown>)[];
}

export function PermanenceTable({ vehicles }: PermanenceTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const sortedVehicles = [...vehicles].sort(
    (a, b) => b.minutesParked - a.minutesParked,
  );

  const totalItems = sortedVehicles.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedVehicles.slice(indexOfFirstItem, indexOfLastItem);

  const columns = [
    {
      key: "rfidTag",
      title: "Etiqueta RFID",
      sortable: false,
      render: (value: unknown) => (typeof value === "string" ? value : "-"),
    },
    {
      key: "plate",
      title: "Placa",
      sortable: false,
      render: (value: unknown) => formatPlate(value),
    },
    {
      key: "minutesParked",
      title: "Permanência",
      sortable: false,
      render: (value: unknown) => formatPermanenceTime(value),
    },
  ];

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-t-lg border border-light-gray">
        <Table columns={columns} data={currentItems} searchable={false} />
      </div>

      <div className="flex select-none items-center justify-center gap-2 rounded-b-lg border-light-gray border-x border-b bg-white p-4">
        <button
          type="button"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-light-gray text-bg-dark text-sm hover:bg-light-gray disabled:opacity-40 disabled:hover:bg-white"
        >
          «
        </button>

        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-light-gray text-bg-dark text-sm hover:bg-light-gray disabled:opacity-40 disabled:hover:bg-white"
        >
          ‹
        </button>

        {(() => {
          const pages: (number | string)[] = [];

          if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
          } else {
            if (currentPage <= 3) {
              pages.push(1, 2, 3, 4, "ellipsis-1", totalPages);
            } else if (currentPage >= totalPages - 2) {
              pages.push(
                1,
                "ellipsis-1",
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages,
              );
            } else {
              pages.push(
                1,
                "ellipsis-1",
                currentPage - 1,
                currentPage,
                currentPage + 1,
                "ellipsis-2",
                totalPages,
              );
            }
          }

          return pages.map((page) => {
            if (typeof page === "string" && page.startsWith("ellipsis")) {
              return (
                <span key={page} className="px-2 text-sm text-zinc-400">
                  ...
                </span>
              );
            }

            const isCurrent = page === currentPage;

            return (
              <button
                key={`page-${page}`}
                type="button"
                onClick={() => setCurrentPage(page as number)}
                className={`flex h-8 w-8 items-center justify-center rounded-full border font-medium text-sm transition-colors ${
                  isCurrent
                    ? "border-blue bg-blue text-white"
                    : "border-light-gray bg-white text-bg-dark hover:bg-light-gray"
                }`}
              >
                {page}
              </button>
            );
          });
        })()}

        <button
          type="button"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-light-gray text-bg-dark text-sm hover:bg-light-gray disabled:opacity-40 disabled:hover:bg-white"
        >
          ›
        </button>

        <button
          type="button"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-light-gray text-bg-dark text-sm hover:bg-light-gray disabled:opacity-40 disabled:hover:bg-white"
        >
          »
        </button>
      </div>
    </div>
  );
}
