import { CircleDollarSign, Clock } from "lucide-react";

import type { TransactionDto } from "@/features/transactions/dtos";
import { VehicleCard } from "@/features/vehicles/components/VehicleCard";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatting";

export type TransactionCardProps = {
  transaction: TransactionDto;
};

const typeLabels = {
  deposit: "Crédito",
  withdrawal: "Saída",
} as const;

function extractPlateFromDescription(description: string): string {
  const match = description.match(/placa\s+([A-Z0-9]+)/i);
  return match?.[1] ?? "-";
}

function formatTransactionDate(isoDate: string) {
  const dateObj = new Date(isoDate);

  const date = dateObj.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const hour = dateObj.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return { date, hour };
}

export function TransactionCard({
  transaction,
}: Readonly<TransactionCardProps>) {
  const { transactionType, amount, description, createdAt } = transaction;
  const isNegative = transactionType === "withdrawal";
  const { date, hour } = formatTransactionDate(createdAt);

  return (
    <article
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-lighter-blue bg-white px-4 py-4"
      data-testid="transaction-card"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 font-bold text-gray text-sm md:text-base">
          <Clock className="size-5" strokeWidth={2.5} />
          <span>
            {date} {hour}
          </span>
        </div>

        <strong
          className={cn(
            "flex items-center gap-2 font-bold text-xl md:text-2xl",
            isNegative ? "text-red" : "text-teal",
          )}
          data-testid="transaction-card-value"
        >
          <span>
            {isNegative ? "-" : "+"}
            {formatCurrency(amount)}
          </span>
        </strong>
      </div>

      <div className="shrink-0">
        {transactionType === "deposit" ? (
          <div className="relative flex size-18.5 flex-col items-center justify-center rounded-2xl border-2 border-dark-blue font-bold">
            <div className="flex size-full flex-col items-center justify-center rounded-2xl">
              <CircleDollarSign size={28} className="text-dark-blue" />
              <span className="mt-1 text-black text-sm">
                {typeLabels[transactionType]}
              </span>
            </div>
          </div>
        ) : (
          <VehicleCard
            licensePlate={extractPlateFromDescription(description)}
            size="sm"
          />
        )}
      </div>
    </article>
  );
}
