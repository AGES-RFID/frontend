import { cn } from "@/utils/cn";
import type { TagStatus } from "@/features/tags/dtos";
export type { TagStatus as Status } from "@/features/tags/dtos";

type StatusProps = {
  status: TagStatus;
};

const statusConfig: Record<
  TagStatus,
  { label: string; className: string; dot: string }
> = {
  AVAILABLE: {
    label: "Livre",
    className: "bg-yellow text-dark-gray",
    dot: "bg-dark-orange",
  },
  IN_USE: {
    label: "Ativa",
    className: "bg-light-green text-dark-gray",
    dot: "bg-green",
  },
  INACTIVE: {
    label: "Inativa",
    className: "bg-light-red text-dark-gray",
    dot: "bg-red",
  },
};

export function StatusBadge({ status }: StatusProps) {
  const config = statusConfig[status];

  if (!config) return null;

  return (
    <div
      className={cn(
        "flex w-24 shrink-0 items-center justify-center gap-2 rounded-full px-3 py-1 font-medium text-sm",
        config.className,
      )}
    >
      <span className={cn("h-3 w-3 rounded-full", config.dot)} />
      <span>{config.label}</span>
    </div>
  );
}
