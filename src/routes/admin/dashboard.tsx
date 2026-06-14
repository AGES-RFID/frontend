import type { GraphData } from "@/components/ui/graph";
import { Graph } from "@/components/ui/graph";
import { MetricCard } from "@/features/dashboard/components/dashboardCard";
import { useDashboardMetrics } from "@/features/dashboard/hooks/useDashboardMetrics";

const mockVehicleFlowSeries: GraphData = [
  {
    name: "Entradas",
    color: "var(--color-blue)",
    points: [
      { timestamp: "2026-06-06T10:00:00", value: 20 },
      { timestamp: "2026-06-06T11:00:00", value: 35 },
      { timestamp: "2026-06-06T12:00:00", value: 10 },
      { timestamp: "2026-06-06T13:00:00", value: 28 },
      { timestamp: "2026-06-06T14:00:00", value: 42 },
      { timestamp: "2026-06-06T15:00:00", value: 30 },
    ],
  },
  {
    name: "Saídas",
    color: "var(--color-dark-orange)",
    points: [
      { timestamp: "2026-06-06T10:00:00", value: 15 },
      { timestamp: "2026-06-06T11:00:00", value: 28 },
      { timestamp: "2026-06-06T12:00:00", value: 40 },
      { timestamp: "2026-06-06T13:00:00", value: 22 },
      { timestamp: "2026-06-06T14:00:00", value: 34 },
      { timestamp: "2026-06-06T15:00:00", value: 27 },
    ],
  },
];

export function Dashboard() {
  const { data: metrics } = useDashboardMetrics();

  return (
    <div className="p-8">
      <h1 className="mb-4 font-bold text-3xl text-dark-gray">Dashboard</h1>
      <p className="mb-6 text-gray">
        Bem-vindo ao painel principal do sistema IMPINJ
      </p>

      <div className="max-w-[704px]">
        <div className="flex max-w-[704px] flex-col gap-4">
          <MetricCard
            topLabel="Horário com mais entradas"
            bottomLabel={metrics?.peakEntryTime ?? "--:--"}
            size="lg"
          />
          <MetricCard
            topLabel="Entradas (Última Hora)"
            bottomLabel={String(metrics?.entriesLastHour ?? 0)}
            size="lg"
          />

          <MetricCard
            topLabel="Saídas (Última Hora)"
            bottomLabel={String(metrics?.exitsLastHour ?? 0)}
            size="lg"
          />
        </div>
      </div>

      <Graph
        title="Fluxo de veículos por hora"
        series={mockVehicleFlowSeries}
        width={900}
        height={400}
      />
    </div>
  );
}
