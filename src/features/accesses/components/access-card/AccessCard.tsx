import { CircleDollarSign, Clock, LogIn, LogOut } from "lucide-react";

import { VehicleCard } from "@/features/vehicles/components/VehicleCard";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatting";

export type AccessCardProps = {
  type: "entry" | "exit" | "deposit" | "withdrawal";
  date: string;
  hour: string;
  tagId?: string; // Optional for deposits
  amount?: number; // Used for transactions
};

const typeLabels = {
  exit: "Saída",
  entry: "Entrada",
  deposit: "Crédito",
  withdrawal: "Saída",
} as const;

export function AccessCard({
  type,
  date,
  hour,
  tagId,
  amount,
}: Readonly<AccessCardProps>) {
  const isNegative = type === "exit" || type === "withdrawal";
  const isFinancial = type === "deposit" || type === "withdrawal";

  return (
    <article
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-lighter-blue bg-white px-4 py-4"
      data-testid="access-card"
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
          data-testid="access-card-value"
        >
          {/* For accesses, show icon + "Entrada"/"Saída". For financials, show formatted amount */}
          {!isFinancial &&
            (isNegative ? (
              <LogOut className="size-6" />
            ) : (
              <LogIn className="size-6" />
            ))}
          {!isFinancial && typeLabels[type]}

          {isFinancial && amount !== undefined && (
            <span>
              {isNegative ? "-" : "+"}
              {formatCurrency(amount)}
            </span>
          )}
        </strong>
      </div>

      <div className="shrink-0">
        {type === "deposit" ? (
          <div className="relative flex size-18.5 flex-col items-center justify-center rounded-2xl border-2 border-dark-blue font-bold">
            <button
              type="button"
              className="flex size-full cursor-default flex-col items-center justify-center rounded-2xl"
            >
              <CircleDollarSign size={28} className="text-dark-blue" />
              <span className="mt-1 text-black text-sm">
                {typeLabels[type]}
              </span>
            </button>
          </div>
        ) : (
          <VehicleCard licensePlate={tagId ?? "-"} size="sm" />
        )}
      </div>
    </article>
  );
}
