import { cn } from "@/utils/cn";

type PricingTableData = {
  ate15Minutos?: string;
  ate3Horas?: string;
  horaAdicional?: string;
};

type PricingTableProps = {
  data?: PricingTableData;
  className?: string;
};

const defaultData: Required<PricingTableData> = {
  ate15Minutos: "Isento",
  ate3Horas: "R$ 15,00",
  horaAdicional: "R$ 5,00",
};

const rows = [
  { label: "Até 15 minutos", key: "ate15Minutos" },
  { label: "Até 3 horas", key: "ate3Horas" },
  { label: "Hora adicional", key: "horaAdicional" },
] as const;

export function PricingTable({ data, className }: PricingTableProps) {
  const finalData = {
    ...defaultData,
    ...data,
  };

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
              key={row.key}
              className={cn(
                "bg-gray-100",
                index !== rows.length - 1 && "border-gray-200 border-b",
              )}
            >
              <td className="border-gray-300 border-r p-3 text-gray-700">
                {row.label}
              </td>

              <td className="p-3 font-medium text-gray-900">
                {finalData[row.key]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
