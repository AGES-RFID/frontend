import { useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { toast } from "@/components/ui/toast";
import { useUsers } from "@/features/users/hooks";
import type { CreateVehicleDto } from "../dtos";
import { useCreateVehicle } from "../hooks";
import { VehicleForm } from "./VehicleForm";

interface VehicleAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
}

export function VehicleAddModal({
  isOpen,
  onClose,
  isAdmin,
}: VehicleAddModalProps) {
  const { data: owners = [], error: ownersError } = useUsers({
    enabled: isOpen && isAdmin,
  });

  const createVehicleMutation = useCreateVehicle();
  const isSubmitting = createVehicleMutation.isPending;

  useEffect(() => {
    if (ownersError) {
      toast.error("Não foi possível carregar os usuários.");
    }
  }, [ownersError]);

  const handleCreateVehicle = (formData: Partial<CreateVehicleDto>) => {
    createVehicleMutation.mutate(formData as CreateVehicleDto, {
      onSuccess: () => {
        toast.success("Veículo criado com sucesso.");
        onClose();
      },
      onError: () => toast.error("Erro ao criar veículo."),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Criar veículo">
      <VehicleForm
        owners={owners}
        showOwnerField={isAdmin}
        submitLabel={isSubmitting ? "Criando..." : "Criar"}
        isSubmitting={isSubmitting}
        onCancel={onClose}
        onSubmit={handleCreateVehicle}
      />
    </Modal>
  );
}
