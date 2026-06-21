import { useMemo } from "react";
import type { GraphData } from "@/components/ui/graph";
import { Graph } from "@/components/ui/graph";
import { useAccessTimeseries } from "@/features/accesses/hooks/useAccessTimeseries";
import { MetricCard } from "@/features/dashboard/components/dashboardCard";
import { ParkingOccupancyCard } from "@/features/dashboard/components/parking-occupancy-card";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";

export function Dashboard() {
  const { data: metrics } = useDashboard();
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
    <div className="grid grid-cols-5 gap-4 p-8">
      <header className="col-span-full">
        <h1 className="mb-4 font-bold text-3xl text-dark-gray">Dashboard</h1>
        <p className="mb-6 text-gray">
          Bem-vindo ao painel principal do sistema IMPINJ
        </p>
      </header>

      <ParkingOccupancyCard
        className="col-span-2"
        isEditable
        totalSpots={metrics?.maxOccupancy || 100}
        vehiclesCount={metrics?.currentOccupancy || 0}
      />

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
        className="col-span-2"
        title="Fluxo de veículos por hora"
        series={vehicleFlowSeries}
      />
    </div>
  );
}
