import { useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { toast } from "@/components/ui/toast";
import { useUsers } from "@/features/users/hooks";
import type { CreateVehicleDto, VehicleWithOwnerDto } from "../dtos";
import { useEditVehicle } from "../hooks";
import { VehicleForm } from "./VehicleForm";

interface VehicleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleWithOwnerDto | null;
}

export function VehicleEditModal({
  isOpen,
  onClose,
  vehicle,
}: VehicleEditModalProps) {
  const { data: owners = [], error: ownersError } = useUsers({
    enabled: isOpen,
  });

  const editVehicleMutation = useEditVehicle();
  const isSubmitting = editVehicleMutation.isPending;

  const handleEditVehicle = (formData: Partial<CreateVehicleDto>) => {
    if (!vehicle) return;

    editVehicleMutation.mutate(
      { vehicleId: vehicle.vehicleId, updateVehicleDto: formData },
      {
        onSuccess: () => {
          toast.success("Veículo atualizado com sucesso.");
          onClose();
        },
        onError: () => toast.error("Erro ao atualizar veículo."),
      },
    );
  };

  useEffect(() => {
    if (ownersError) {
      toast.error("Não foi possível carregar os usuários.");
    }
  }, [ownersError]);

  const initialValues: Partial<CreateVehicleDto> = vehicle
    ? {
        userId: vehicle.userId,
        plate: vehicle.plate,
        brand: vehicle.brand,
        model: vehicle.model,
      }
    : {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar veículo">
      <VehicleForm
        initialValues={initialValues}
        owners={owners}
        showOwnerField
        submitLabel="Salvar"
        isSubmitting={isSubmitting}
        onCancel={onClose}
        onSubmit={handleEditVehicle}
      />
    </Modal>
  );
}
