import { useMemo } from "react";
import { Table } from "@/components/ui/table";
import type { TableColumn } from "@/components/ui/table/types";
import type { AccessDto } from "@/features/accesses/dtos";
import {
  formatCurrency,
  formatDateTime,
  formatPlate,
} from "@/utils/formatting";

type RecentExitsTableProps = {
  accesses: AccessDto[];
  isLoading?: boolean;
};

export function RecentExitsTable({
  accesses,
  isLoading = false,
}: Readonly<RecentExitsTableProps>) {
  const orderedAccesses = useMemo(() => {
    if (!Array.isArray(accesses)) return [];

    return [...accesses].sort((a, b) => {
      const dateA = a?.timestamp ? new Date(a.timestamp).getTime() : 0;
      const dateB = b?.timestamp ? new Date(b.timestamp).getTime() : 0;
      return dateB - dateA;
    });
  }, [accesses]);

  const columns: TableColumn<AccessDto>[] = [
    {
      key: "timestamp",
      title: "Horário",
      sortable: false,
      render: (value) => {
        if (!value) return "-";

        const formatted = formatDateTime(String(value));

        if (!formatted || typeof formatted !== "string") return "-";

        return formatted.replace(/,?\s+/, " às ");
      },
    },
    {
      key: "plate",
      title: "Placa",
      sortable: false,
      render: (value) => formatPlate(value),
    },
    {
      key: "value",
      title: "Valor",
      sortable: false,
      render: (value) => {
        if (typeof value !== "number" || Number.isNaN(value)) return "-";

        return (
          <span className="font-medium text-teal">{formatCurrency(value)}</span>
        );
      },
    },
  ];

  return (
    <Table
      data={orderedAccesses}
      columns={columns}
      loading={isLoading}
      searchable={false}
      paginationPageSize={5}
    />
  );
}
