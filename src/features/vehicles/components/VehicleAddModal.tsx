import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CreateVehicleDto } from "../dtos";
import type { UserListDto } from "@/features/users/dtos";

interface VehicleAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSubmitting: boolean;
  onSubmit: (values: CreateVehicleDto) => void;
  isAdmin: boolean;
  owners: UserListDto;
}

const defaultValues: CreateVehicleDto = {
  userId: "",
  plate: "",
  brand: "",
  model: "",
};

// Placa modelo antigo (ABC1234) e atual (ABC1D23)
const plateRegex = /^[A-Z]{3}\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/;

export function VehicleAddModal({
  isOpen,
  onClose,
  isSubmitting,
  onSubmit,
  isAdmin,
  owners,
}: VehicleAddModalProps) {
  const [formData, setFormData] = useState<CreateVehicleDto>(defaultValues);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(defaultValues);
      setValidationError(null);
    }
  }, [isOpen]);

  const updateField = (field: keyof CreateVehicleDto, value: string) => {
    if (validationError) setValidationError(null);

    if (field === "plate") {
      value = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!plateRegex.test(formData.plate)) {
      setValidationError("Placa inválida. Use formato ABC1234 ou ABC1D23.");
      return;
    }

    onSubmit(formData);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Criar veículo">
      <form className="space-y-4" onSubmit={handleSubmit}>
        {isAdmin && (
          <label className="flex flex-col gap-1 font-medium text-dark-gray text-sm">
            Proprietário
            <select
              className="h-10 rounded-md border border-light-gray bg-white px-4 text-dark-gray outline-none focus:border-dark-gray"
              value={formData.userId}
              onChange={(e) => updateField("userId", e.target.value)}
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
        )}

        <Input
          label="Placa"
          value={formData.plate}
          onChange={(e) => updateField("plate", e.target.value)}
          required
          maxLength={7}
          placeholder="ABC1234 ou ABC1D23"
          width="100%"
        />

        <Input
          label="Marca"
          value={formData.brand}
          onChange={(e) => updateField("brand", e.target.value)}
          required
          width="100%"
        />

        <Input
          label="Modelo"
          value={formData.model}
          onChange={(e) => updateField("model", e.target.value)}
          required
          width="100%"
        />

        {validationError && (
          <p className="text-red text-sm">{validationError}</p>
        )}

        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant="secondary" type="button">
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
