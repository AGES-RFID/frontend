import { Clock, LogIn, LogOut } from "lucide-react";

import { VehicleCard } from "@/features/vehicles/components/VehicleCard";
import { cn } from "@/utils/cn";

export type HistoryCardProps = {
  type: "entry" | "exit";
  date: string;
  hour: string;
  tagId: string; // From AccessDto
};

const historyTypeLabel = {
  exit: "Saída",
  entry: "Entrada",
} as const;

export function HistoryCard({
  type,
  date,
  hour,
  tagId,
}: Readonly<HistoryCardProps>) {
  const isExit = type === "exit";

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
            "flex items-center gap-2 font-bold text-xl md:text-2xl",
            isExit ? "text-red" : "text-teal",
          )}
          data-testid="history-card-value"
        >
          {isExit ? (
            <LogOut className="size-6" />
          ) : (
            <LogIn className="size-6" />
          )}
          {historyTypeLabel[type]}
        </strong>
      </div>

      <div className="shrink-0">
        <VehicleCard licensePlate={tagId} size="sm" />
      </div>
    </article>
  );
}
