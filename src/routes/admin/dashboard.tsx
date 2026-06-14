import { useMemo } from "react";
import type { GraphData } from "@/components/ui/graph";
import { Graph } from "@/components/ui/graph";
import { useAccessTimeseries } from "@/features/accesses/hooks/useAccessTimeseries";
import { MetricCard } from "@/features/dashboard/components/dashboardCard";
import { useDashboardMetrics } from "@/features/dashboard/hooks/useDashboardMetrics";

export function Dashboard() {
  const { data: metrics } = useDashboardMetrics();
  const { data: timeseries } = useAccessTimeseries();

  const vehicleFlowSeries: GraphData = useMemo(() => {
    if (!timeseries?.series) return [];

    return timeseries.series.map((s) => {
      const name = s.key === "entries" ? "Entradas" : "Saídas";
      const color =
        s.key === "entries" ? "var(--color-blue)" : "var(--color-dark-orange)";

      return {
        name,
        color,
        points: s.points.map((p) => ({
          timestamp: p.timestamp,
          value: p.count,
        })),
      };
    });
  }, [timeseries]);

  return (
    <div className="grid grid-cols-3 gap-4 p-8">
      <header className="col-span-3">
        <h1 className="mb-4 font-bold text-3xl text-dark-gray">Dashboard</h1>
        <p className="mb-6 text-gray">
          Bem-vindo ao painel principal do sistema IMPINJ
        </p>
      </header>

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

      <Graph
        className="col-span-3"
        title="Fluxo de veículos por hora"
        series={vehicleFlowSeries}
        width={900}
        height={400}
      />
    </div>
  );
}
