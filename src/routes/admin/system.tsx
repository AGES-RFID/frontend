import { Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AntennaCard } from "@/components/ui/antenna";
import { AdjustAntennaModal } from "@/features/antennas/components/AdjustAntennaModal";
import type { AntennaDto } from "@/features/antennas/dtos";
import { EditValuesModal } from "@/features/parking-prices/components/EditValuesModal";
import { PricingTable } from "@/features/parking-prices/components/PricingTable";

export function System() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAntenna, setSelectedAntenna] = useState<AntennaDto | null>(
    null,
  );
  const [isAntennaModalOpen, setIsAntennaModalOpen] = useState(false);

  // Mocked list of antennas for display and interaction
  const mockAntennas: AntennaDto[] = [
    {
      id: "antenna-1",
      name: "Antena 1 (Entrada)",
      status: "On",
      sensibility: -50,
      power: 28.0,
    },
    {
      id: "antenna-2",
      name: "Antena 2 (Saída)",
      status: "Off",
      sensibility: -50,
      power: 28.0,
    },
  ];

  const handleEditAntenna = (antenna: AntennaDto) => {
    setSelectedAntenna(antenna);
    setIsAntennaModalOpen(true);
  };

  return (
    <div className="p-8">
      <h1 className="mb-4 font-bold text-3xl text-dark-gray">Sistema</h1>
      <p className="mb-6 text-gray">Configurações e administração do sistema</p>

      <div className="max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-dark-gray text-xl">
            Valores de Estacionamento
          </h2>
          <Button
            onClick={() => setIsEditModalOpen(true)}
            variant="secondary"
            className="gap-2"
          >
            <Pencil className="h-4 w-4" />
            Editar Valores
          </Button>
        </div>

        <PricingTable className="w-full" />

        <hr className="my-8 border-very-light-gray/40" />

        <div className="mb-4">
          <h2 className="mb-4 font-semibold text-dark-gray text-xl">
            Status das Antenas
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {mockAntennas.map((antenna) => (
              <AntennaCard
                key={antenna.id}
                name={antenna.name}
                status={antenna.status}
                sensitivity={
                  antenna.sensibility !== null
                    ? `${antenna.sensibility} dBm`
                    : ""
                }
                power={antenna.power !== null ? `${antenna.power} dBm` : ""}
                editable
                onEdit={() => handleEditAntenna(antenna)}
              />
            ))}
          </div>
        </div>
      </div>

      <EditValuesModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <AdjustAntennaModal
        isOpen={isAntennaModalOpen}
        onClose={() => setIsAntennaModalOpen(false)}
        antenna={selectedAntenna}
      />
    </div>
  );
}
