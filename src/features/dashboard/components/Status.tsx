type Status = "ativa" | "livre" | "inativa";

type StatusProps = {
  status: Status;
};

const statusConfig: Record<
  Status,
  { label: string; className: string; dot: string }
> = {
  ativa: {
    label: "Ativa",
    className: "bg-light-green text-dark-gray",
    dot: "bg-green",
  },
  livre: {
    label: "Livre",
    className: "bg-yellow text-dark-gray",
    dot: "bg-dark-orange",
  },
  inativa: {
    label: "Inativa",
    className: "bg-light-red text-dark-gray",
    dot: "bg-red",
  },
};

export function StatusBadge({ status }: StatusProps) {
  const config = statusConfig[status];

  return (
    <div
      className={`flex w-24 flex-shrink-0 items-center justify-center gap-2 rounded-full px-3 py-1 font-medium text-sm ${config.className}`}
    >
      <span className={`h-3 w-3 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </div>
  );
}
