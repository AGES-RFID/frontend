import { CircleDollarSign, Clock } from "lucide-react";

import { VehicleCard } from "@/features/vehicles/components/VehicleCard";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatting";

type HistoryCardBaseProps = {
  value: number;
  date: string;
  hour: string;
};

type HistoryExitCardProps = HistoryCardBaseProps & {
  type: "exit";
  licensePlate: string;
};

type HistoryCreditCardProps = HistoryCardBaseProps & {
  type: "credit";
  licensePlate?: string;
};

type HistoryCardProps = HistoryExitCardProps | HistoryCreditCardProps;

function CreditIconCard() {
  return (
    <div className="flex size-18.5 flex-col items-center justify-center rounded-2xl border-2 border-dark-blue font-bold">
      <CircleDollarSign className="size-7 text-dark-blue" strokeWidth={2.5} />

      <span className="mt-1 text-black text-sm">Crédito</span>
    </div>
  );
}

export function HistoryCard({
  type,
  value,
  date,
  hour,
  ...props
}: Readonly<HistoryCardProps>) {
  const isExit = type === "exit";

  const valuePrefix = isExit ? "-" : "+";
  const formattedValue = formatCurrency(Math.abs(value));

  return (
    <article
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-lighter-blue bg-white px-4 py-4"
      data-testid="history-card"
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
            "font-bold text-xl md:text-2xl",
            isExit ? "text-red" : "text-teal",
          )}
          data-testid="history-card-value"
        >
          {valuePrefix}
          {formattedValue}
        </strong>
      </div>

      <div className="shrink-0">
        {isExit ? (
          <VehicleCard licensePlate={props.licensePlate!} size="sm" />
        ) : (
          <CreditIconCard />
        )}
      </div>
    </article>
  );
}
