import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CreateVehicleDto } from "../dtos";

type OwnerOption = {
  userId: string;
  name: string;
  email: string;
};

interface VehicleFormProps {
  initialValues?: Partial<CreateVehicleDto>;
  owners: OwnerOption[];
  showOwnerField?: boolean;
  ownerPlaceholder?: string;
  submitLabel: string;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (formData: Partial<CreateVehicleDto>) => void;
}

const defaultValues: Partial<CreateVehicleDto> = {
  userId: "",
  plate: "",
  brand: "",
  model: "",
};

// Placa modelo antigo (ABC1234) e atual (ABC1D23)
const plateRegex = /^[A-Z]{3}\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/;

export function VehicleForm({
  initialValues,
  owners,
  showOwnerField = true,
  ownerPlaceholder = "Selecione um proprietário",
  submitLabel,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: VehicleFormProps) {
  const [formData, setFormData] = useState<Partial<CreateVehicleDto>>({
    ...defaultValues,
    ...initialValues,
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      ...defaultValues,
      ...initialValues,
    });
    setValidationError(null);
  }, [initialValues]);

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

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!plateRegex.test(formData.plate ?? "")) {
      setValidationError("Placa inválida. Use formato ABC1234 ou ABC1D23.");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {showOwnerField && (
        <label className="flex flex-col gap-1 font-medium text-dark-gray text-sm">
          Proprietário
          <select
            className="h-10 rounded-md border border-light-gray bg-white px-4 text-dark-gray outline-none focus:border-dark-gray"
            value={formData.userId ?? ""}
            onChange={(e) => updateField("userId", e.target.value)}
            required
          >
            <option value="">{ownerPlaceholder}</option>
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
        value={formData.plate ?? ""}
        onChange={(e) => updateField("plate", e.target.value)}
        required
        maxLength={7}
        placeholder="ABC1234 ou ABC1D23"
        width="100%"
      />

      <Input
        label="Marca"
        value={formData.brand ?? ""}
        onChange={(e) => updateField("brand", e.target.value)}
        required
        width="100%"
        placeholder="Digite a marca"
      />

      <Input
        label="Modelo"
        value={formData.model ?? ""}
        onChange={(e) => updateField("model", e.target.value)}
        required
        width="100%"
        placeholder="Digite o modelo"
      />

      {validationError && <p className="text-red text-sm">{validationError}</p>}

      <div className="flex justify-end gap-2">
        <Button onClick={onCancel} variant="secondary" type="button">
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
