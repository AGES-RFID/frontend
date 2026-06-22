import { useMemo, useState } from "react";
import { AntennaCard } from "@/components/ui/antenna";
import type { GraphData } from "@/components/ui/graph";
import { Graph } from "@/components/ui/graph";
import { useAccessTimeseries } from "@/features/accesses/hooks/useAccessTimeseries";
import { AdjustAntennaModal } from "@/features/antennas/components/AdjustAntennaModal";
import type { AntennaDto } from "@/features/antennas/dtos";
import { useAntennas } from "@/features/antennas/hooks";
import { MetricCard } from "@/features/dashboard/components/dashboardCard";
import { ParkingOccupancyCard } from "@/features/dashboard/components/parking-occupancy-card";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { usePermanence } from "@/features/dashboard/hooks/usePermanence";
import { PermanenceTable } from "@/features/vehicles/components/permanenceTable";

export function Dashboard() {
  const { data: metrics } = useDashboard();
  const { data: timeseries } = useAccessTimeseries();
  const { data: permanenceVehicles } = usePermanence();
  const { data: antennas = [], isLoading: isLoadingAntennas } = useAntennas();

  const [selectedAntenna, setSelectedAntenna] = useState<AntennaDto | null>(
    null,
  );
  const [isAntennaModalOpen, setIsAntennaModalOpen] = useState(false);

  const handleEditAntenna = (antenna: AntennaDto) => {
    setSelectedAntenna(antenna);
    setIsAntennaModalOpen(true);
  };

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
    <div className="grid grid-cols-12 gap-4 p-8">
      <AdjustAntennaModal
        isOpen={isAntennaModalOpen}
        onClose={() => setIsAntennaModalOpen(false)}
        antenna={selectedAntenna}
      />

      <header className="col-span-full">
        <h1 className="mb-4 font-bold text-3xl text-dark-gray">Dashboard</h1>
        <p className="mb-6 text-gray">
          Bem-vindo ao painel principal do sistema IMPINJ
        </p>
      </header>

      <ParkingOccupancyCard
        className="col-span-6"
        isEditable
        totalSpots={metrics?.maxOccupancy || 100}
        vehiclesCount={metrics?.currentOccupancy || 0}
      />

      <MetricCard
        className="col-span-2"
        topLabel="Horário com mais entradas"
        bottomLabel={metrics?.peakEntryTime ?? "--:--"}
        size="lg"
      />
      <MetricCard
        className="col-span-2"
        topLabel="Entradas (Última Hora)"
        bottomLabel={String(metrics?.entriesLastHour ?? 0)}
        size="lg"
      />

      <MetricCard
        className="col-span-2"
        topLabel="Saídas (Última Hora)"
        bottomLabel={String(metrics?.exitsLastHour ?? 0)}
        size="lg"
      />

      <Graph
        className="col-span-8"
        title="Fluxo de veículos por hora"
        series={vehicleFlowSeries}
        height={250}
      />

      <div className="col-span-4 row-span-2 flex flex-col gap-6 rounded-md bg-white p-6 drop-shadow-lg">
        {isLoadingAntennas ? (
          <p className="text-gray text-sm">Carregando antenas...</p>
        ) : (
          antennas.map((antenna) => (
            <AntennaCard
              editable
              onEdit={() => handleEditAntenna(antenna)}
              key={antenna.id}
              name={antenna.name}
              power={antenna.power ?? ""}
              sensitivity={antenna.sensibility ?? ""}
              status={antenna.status}
            />
          ))
        )}
      </div>

      <PermanenceTable
        className="col-span-8"
        vehicles={permanenceVehicles ?? []}
      />
    </div>
  );
}
