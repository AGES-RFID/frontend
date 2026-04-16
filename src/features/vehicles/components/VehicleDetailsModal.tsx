import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import type { VehicleWithOwnerDto } from "../dtos";
import { formatDateTime } from "@/utils/formatting";

interface VehicleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleWithOwnerDto | null;
}

export function VehicleDetailsModal({
  isOpen,
  onClose,
  vehicle,
}: VehicleDetailsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes do veículo"
    >
      {vehicle ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-gray text-xs uppercase tracking-wide">ID</p>
              <p className="break-all text-dark-gray">
                {vehicle.vehicleId}
              </p>
            </div>
            <div>
              <p className="text-gray text-xs uppercase tracking-wide">
                Placa
              </p>
              <p className="text-dark-gray">{vehicle.plate}</p>
            </div>
            <div>
              <p className="text-gray text-xs uppercase tracking-wide">
                Marca
              </p>
              <p className="text-dark-gray">{vehicle.brand}</p>
            </div>
            <div>
              <p className="text-gray text-xs uppercase tracking-wide">
                Modelo
              </p>
              <p className="text-dark-gray">{vehicle.model}</p>
            </div>
            <div>
              <p className="text-gray text-xs uppercase tracking-wide">
                Proprietário
              </p>
              <p className="text-dark-gray">
                {vehicle.owner?.name ?? "Usuário não encontrado"}
              </p>
              <p className="text-gray text-sm">
                {vehicle.owner?.email ?? "-"}
              </p>
            </div>
            <div>
              <p className="text-gray text-xs uppercase tracking-wide">
                Criado em
              </p>
              <p className="text-dark-gray">
                {formatDateTime(vehicle.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-gray text-xs uppercase tracking-wide">
                Atualizado em
              </p>
              <p className="text-dark-gray">
                {formatDateTime(vehicle.updatedAt)}
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={onClose}
              variant="secondary"
              type="button"
            >
              Fechar
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
