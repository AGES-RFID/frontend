import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CreateVehicleDto } from "../dtos";
import type { VehicleWithOwnerDto } from "../dtos";
import type { UserListDto } from "@/features/users/dtos";

interface VehicleEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleWithOwnerDto | null;
  owners: UserListDto;
  isSubmitting: boolean;
  onSubmit: (formData: Partial<CreateVehicleDto>) => void;
}

type EditFormValues = Partial<CreateVehicleDto>;

const emptyForm: EditFormValues = {
  userId: "",
  plate: "",
  brand: "",
  model: "",
};

export function VehicleEditModal({
  isOpen,
  onClose,
  vehicle,
  owners,
  isSubmitting,
  onSubmit,
}: VehicleEditModalProps) {
  const [form, setForm] = useState<EditFormValues>(emptyForm);

  useEffect(() => {
    if (isOpen && vehicle) {
      setForm({
        userId: vehicle.userId,
        plate: vehicle.plate,
        brand: vehicle.brand,
        model: vehicle.model,
      });
    }
  }, [isOpen, vehicle]);

  const handleFieldChange =
    (field: keyof EditFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((currentForm) => ({
        ...currentForm,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar veículo"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1 font-medium text-dark-gray text-sm">
          Proprietário
          <select
            className="h-10 rounded-md border border-light-gray bg-white px-4 text-dark-gray outline-none focus:border-dark-gray"
            value={form.userId || ""}
            onChange={handleFieldChange("userId")}
            required
          >
            <option value="">Selecione um proprietário</option>
            {owners.map((owner) => (
              <option key={owner.userId} value={owner.userId}>
                {owner.name} - {owner.email}
              </option>
            ))}
          </select>
        </label>
        <Input
          label="Placa"
          value={form.plate || ""}
          onChange={handleFieldChange("plate")}
          required
          width="100%"
          maxLength={7}
          placeholder="ABC1234 ou ABC1D23"
        />
        <Input
          label="Marca"
          value={form.brand || ""}
          onChange={handleFieldChange("brand")}
          required
          width="100%"
          placeholder="Digite a marca"
        />
        <Input
          label="Modelo"
          value={form.model || ""}
          onChange={handleFieldChange("model")}
          required
          width="100%"
          placeholder="Digite o modelo"
        />

        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant="secondary" type="button">
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
