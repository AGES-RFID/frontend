import { TableSkeleton } from "@/components/ui/table/TableSkeleton";

import { usePricing } from "@/features/parking-prices/hooks";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatting";

type PricingTableProps = Readonly<{
  className?: string;
}>;

const formatThresholdLabel = (thresholdMinutes: number) => {
  if (thresholdMinutes > 0 && thresholdMinutes % 60 === 0) {
    const hours = thresholdMinutes / 60;
    return `Até ${hours} ${hours === 1 ? "hora" : "horas"}`;
  }

  return `Até ${thresholdMinutes} minutos`;
};

export function PricingTable({ className }: PricingTableProps) {
  const { data: pricing, isLoading, isError } = usePricing();

  if (isLoading) {
    return (
      <div
        className={cn(
          "overflow-hidden rounded-2xl border border-gray-300",
          className,
        )}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-dark-blue text-white">
              <th className="w-1/2 border-white/30 border-r p-3 text-left font-semibold">
                Tempo
              </th>
              <th className="w-1/2 p-3 text-left font-semibold">Valor</th>
            </tr>
          </thead>
          <TableSkeleton columnsCount={2} actionsCount={0} />
        </table>
      </div>
    );
  }

  if (isError || !pricing) {
    return (
      <div className="text-red-500">Erro ao carregar tabela de preços.</div>
    );
  }

  const rows = [
    { label: `Até ${pricing.toleranceMinutes} minutos`, value: "Isento" },
    {
      label: formatThresholdLabel(pricing.thresholdMinutes),
      value: formatCurrency(pricing.basePrice),
    },
    { label: "Hora adicional", value: formatCurrency(pricing.hourlyRate) },
  ];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-gray-300",
        className,
      )}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-dark-blue text-white">
            <th className="w-1/2 border-white/30 border-r p-3 text-left font-semibold">
              Tempo
            </th>
            <th className="w-1/2 p-3 text-left font-semibold">Valor</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.label}
              className={cn(
                "bg-white",
                index !== rows.length - 1 && "border-light-gray border-b",
              )}
            >
              <td className="border-light-gray border-r p-3 text-dark-gray">
                {row.label}
              </td>

              <td className="p-3 font-medium text-gray">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
