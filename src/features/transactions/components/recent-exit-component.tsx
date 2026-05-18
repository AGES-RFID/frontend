import { useMemo } from "react";
import { Table } from "@/components/ui/table";
import type { TableColumn } from "@/components/ui/table/types";
import { formatDateTime, formatCurrency } from "@/utils/formatting";
import type { TransactionDto } from "@/features/transactions/dtos/transactionDto";
import { formatPlate } from "@/utils/formatting";

interface RecentTransactions {
  transactions: TransactionDto[];
  isLoading?: boolean;
}

export function RecentExitComponent({
  transactions,
  isLoading = false,
}: RecentTransactions) {
  const orderedTransactions = useMemo(() => {
    if (!Array.isArray(transactions)) return [];

    return [...transactions].sort((a, b) => {
      const dataA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dataB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dataB - dataA;
    });
  }, [transactions]);

  const columns: TableColumn<TransactionDto>[] = [
    {
      key: "createdAt",
      title: "Horário",
      sortable: false,
      render: (value) => {
        if (!value) return "-";

        const formatado = formatDateTime(String(value));

        if (!formatado || typeof formatado !== "string") return "-";

        return formatado.replace(/,?\s+/, " às ");
      },
    },
    {
      key: "description",
      title: "Placa",
      sortable: false,
      render: (value) => formatPlate(value),
    },
    {
      key: "amount",
      title: "Valor",
      sortable: false,
      render: (value) => {
        const valorNumerico =
          typeof value === "number" && !Number.isNaN(value) ? value : 0;
        return (
          <span className="font-medium text-teal">
            {formatCurrency(valorNumerico)}
          </span>
        );
      },
    },
  ];

  return (
    <Table
      data={orderedTransactions}
      columns={columns}
      loading={isLoading}
      searchable={false}
      paginationPageSize={5}
    />
  );
}
