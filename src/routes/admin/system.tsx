import { Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EditValuesModal } from "@/features/parking-prices/components/EditValuesModal";
import { PricingTable } from "@/features/parking-prices/components/PricingTable";

export function System() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
      </div>

      <EditValuesModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}
