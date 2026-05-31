import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { parseNumber } from "@/utils/parseNumber";
import { usePricing, useUpdatePricing } from "../hooks";

interface EditValuesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const getThresholdLabel = (thresholdMinutes?: number) => {
  if (!thresholdMinutes || thresholdMinutes < 1) {
    return "até o limite configurado";
  }

  if (thresholdMinutes % 60 === 0) {
    const hours = thresholdMinutes / 60;
    return `até ${hours} ${hours === 1 ? "hora" : "horas"}`;
  }

  return `até ${thresholdMinutes} minutos`;
};

export function EditValuesModal({ isOpen, onClose }: EditValuesModalProps) {
  const { data: pricing } = usePricing();
  const { mutate: updatePricing, isPending } = useUpdatePricing();

  const [toleranceMinutes, setToleranceMinutes] = useState("15");
  const [basePrice, setBasePrice] = useState("15");
  const [hourlyRate, setHourlyRate] = useState("5");

  useEffect(() => {
    if (pricing) {
      setToleranceMinutes(String(pricing.toleranceMinutes));
      setBasePrice(String(pricing.basePrice));
      setHourlyRate(String(pricing.hourlyRate));
    }
  }, [pricing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pricing?.parkingPriceId) return;

    const tolerance = parseNumber(toleranceMinutes);
    const base = parseNumber(basePrice);
    const hourly = parseNumber(hourlyRate);

    if (tolerance === null || base === null || hourly === null) return;

    updatePricing(
      {
        parkingPriceId: pricing.parkingPriceId,
        updateDto: {
          toleranceMinutes: tolerance,
          basePrice: base,
          hourlyRate: hourly,
        },
      },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Valores">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="toleranceMinutes"
            className="mb-1 block font-medium text-gray-700 text-sm"
          >
            Tempo de Isenção (minutos)
          </label>
          <input
            id="toleranceMinutes"
            type="number"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={toleranceMinutes}
            onChange={(e) => setToleranceMinutes(e.target.value)}
            required
            min="0"
          />
        </div>

        <div>
          <label
            htmlFor="basePrice"
            className="mb-1 block font-medium text-gray-700 text-sm"
          >
            Valor {getThresholdLabel(pricing?.thresholdMinutes)} (R$)
          </label>
          <input
            id="basePrice"
            type="number"
            step="0.01"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            required
            min="0"
          />
        </div>

        <div>
          <label
            htmlFor="hourlyRate"
            className="mb-1 block font-medium text-gray-700 text-sm"
          >
            Valor da Hora Adicional (R$)
          </label>
          <input
            id="hourlyRate"
            type="number"
            step="0.01"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            required
            min="0"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" onClick={onClose} variant="secondary">
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isPending || !pricing?.parkingPriceId}
          >
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
