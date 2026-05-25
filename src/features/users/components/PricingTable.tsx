import { TableSkeleton } from "@/components/ui/table/TableSkeleton";

import { usePricing } from "@/features/parking-prices/hooks";
import { cn } from "@/utils/cn";

type PricingTableProps = Readonly<{
  className?: string;
}>;

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
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
    { label: "Até 3 horas", value: formatCurrency(pricing.basePrice) },
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
