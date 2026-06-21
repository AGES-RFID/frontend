import { useMemo } from "react";
import { AntennaCard } from "@/components/ui/antenna";
import type { GraphData } from "@/components/ui/graph";
import { Graph } from "@/components/ui/graph";
import type { AccessDto } from "@/features/accesses/dtos";
import { useAccesses } from "@/features/accesses/hooks/useAccesses";
import { useAccessTimeseries } from "@/features/accesses/hooks/useAccessTimeseries";
import { useAntennas } from "@/features/antennas/hooks";
import { MetricCard } from "@/features/dashboard/components/dashboardCard";
import { ParkingOccupancyCard } from "@/features/dashboard/components/parking-occupancy-card";
import { useDashboardMetrics } from "@/features/dashboard/hooks/useDashboardMetrics";
import { useOccupancy } from "@/features/dashboard/hooks/useOccupancy";
import { PermanenceTable } from "@/features/vehicles/components/permanenceTable";
import type { PermanenceDto } from "@/features/vehicles/dtos/permanenceDto";

function getLatestAccessesByVehicle(accesses: AccessDto[]) {
  const latestAccesses = new Map<string, AccessDto>();

  for (const access of accesses) {
    const key = access.tagId ?? access.plate ?? access.accessId;
    if (!key || !access.timestamp) continue;

    const currentTimestamp = new Date(access.timestamp).getTime();
    if (Number.isNaN(currentTimestamp)) continue;

    const latestAccess = latestAccesses.get(key);
    const latestTimestamp = latestAccess?.timestamp
      ? new Date(latestAccess.timestamp).getTime()
      : Number.NEGATIVE_INFINITY;

    if (!latestAccess || currentTimestamp > latestTimestamp) {
      latestAccesses.set(key, access);
    }
  }

  return Array.from(latestAccesses.values());
}

function toPermanenceVehicles(accesses: AccessDto[]): PermanenceDto[] {
  const now = Date.now();

  return getLatestAccessesByVehicle(accesses)
    .filter((access) => access.type === "entry" && access.timestamp)
    .map((access) => {
      const entryTimestamp = new Date(access.timestamp ?? "").getTime();
      const minutesParked = Number.isNaN(entryTimestamp)
        ? 0
        : Math.max(0, Math.floor((now - entryTimestamp) / 60_000));

      return {
        rfidTag: access.tagId ?? "-",
        plate: access.plate ?? "-",
        minutesParked,
      };
    });
}

export function Dashboard() {
  const { data: metrics } = useDashboardMetrics();
  const { data: occupancy } = useOccupancy();
  const { data: timeseries } = useAccessTimeseries();
  const { data: antennas = [], isLoading: isLoadingAntennas } = useAntennas();
  const { data: accesses = [] } = useAccesses();

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

  const permanenceVehicles = useMemo(
    () => toPermanenceVehicles(accesses),
    [accesses],
  );

  return (
    <div className="grid gap-5 p-8 xl:grid-cols-[minmax(0,1fr)_330px]">
      <header className="xl:col-span-2">
        <h1 className="text-center font-bold text-3xl text-dark-blue">
          Monitoramento em tempo real
        </h1>
      </header>

      <main className="grid min-w-0 gap-5">
        <section className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(160px,1fr))]">
          <ParkingOccupancyCard
            vehiclesCount={occupancy?.currentOccupancy ?? 0}
            totalSpots={occupancy?.maxOccupancy ?? metrics?.maxOccupancy ?? 0}
            className="h-full rounded-md px-6 py-5"
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
          <MetricCard
            topLabel="Horário com mais entradas"
            bottomLabel={metrics?.peakEntryTime ?? "--:--"}
            size="lg"
          />
        </section>

        <Graph
          className="min-w-0 overflow-x-auto"
          title="Fluxo de veículos por hora"
          series={vehicleFlowSeries}
          width={760}
          height={300}
        />

        <section className="rounded-lg bg-white drop-shadow-lg">
          <PermanenceTable vehicles={permanenceVehicles} />
        </section>
      </main>

      <aside className="rounded-lg bg-white p-5 drop-shadow-lg">
        <h2 className="mb-4 font-bold text-dark-gray text-xl">Antenas</h2>

        {isLoadingAntennas ? (
          <p className="text-gray text-sm">Carregando antenas...</p>
        ) : antennas.length === 0 ? (
          <p className="text-gray text-sm">Nenhuma antena cadastrada.</p>
        ) : (
          <div className="grid gap-4">
            {antennas.map((antenna) => (
              <AntennaCard
                key={antenna.id}
                name={antenna.name}
                status={antenna.status}
                sensitivity={antenna.sensibility ?? ""}
                power={antenna.power ?? ""}
                className="max-w-none drop-shadow-lg"
              />
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}
