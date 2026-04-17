import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { toast } from "@/components/ui/toast";
import type { VehicleWithOwnerDto } from "../dtos";
import { useDeleteVehicle } from "../hooks";

interface VehicleDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleWithOwnerDto | null;
}

export function VehicleDeleteModal({
  isOpen,
  onClose,
  vehicle,
}: VehicleDeleteModalProps) {
  const deleteVehicleMutation = useDeleteVehicle();
  const isDeleting = deleteVehicleMutation.isPending;

  const handleDeleteVehicle = () => {
    if (!vehicle) return;

    deleteVehicleMutation.mutate(
      { vehicleId: vehicle.vehicleId },
      {
        onSuccess: () => {
          toast.success("Veículo excluído com sucesso.");
          close();
        },
        onError: () => toast.error("Erro ao excluir veículo."),
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Excluir veículo">
      <div className="space-y-4">
        <p>Tem certeza que deseja excluir o veículo "{vehicle?.plate}"?</p>
        <p className="text-gray text-sm">Esta ação não pode ser desfeita.</p>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant="secondary" type="button">
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteVehicle}
            variant="destructive"
            type="button"
            disabled={isDeleting}
          >
            Excluir
          </Button>
        </div>
      </div>
    </Modal>
  );
}
