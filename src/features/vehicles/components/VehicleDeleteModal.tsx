import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import type { VehicleWithOwnerDto } from "../dtos";

interface VehicleDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleWithOwnerDto | null;
  isDeleting: boolean;
  onConfirm: () => void;
}

export function VehicleDeleteModal({
  isOpen,
  onClose,
  vehicle,
  isDeleting,
  onConfirm,
}: VehicleDeleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Excluir veículo"
    >
      <div className="space-y-4">
        <p>
          Tem certeza que deseja excluir o veículo "{vehicle?.plate}"?
        </p>
        <p className="text-gray text-sm">Esta ação não pode ser desfeita.</p>

        <div className="flex justify-end gap-2">
          <Button
            onClick={onClose}
            variant="secondary"
            type="button"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
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
