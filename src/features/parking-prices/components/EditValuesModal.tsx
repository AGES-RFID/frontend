import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { usePricing, useUpdatePricing } from "../hooks";

interface EditValuesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditValuesModal({ isOpen, onClose }: EditValuesModalProps) {
  const { data: pricing } = usePricing();
  const { mutate: updatePricing, isPending } = useUpdatePricing();

  const [toleranceMinutes, setToleranceMinutes] = useState<number>(15);
  const [basePrice, setBasePrice] = useState<number>(15.0);
  const [hourlyRate, setHourlyRate] = useState<number>(5.0);

  useEffect(() => {
    if (pricing) {
      setToleranceMinutes(pricing.toleranceMinutes);
      setBasePrice(pricing.basePrice);
      setHourlyRate(pricing.hourlyRate);
    }
  }, [pricing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePricing(
      {
        toleranceMinutes,
        basePrice,
        hourlyRate,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
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
            onChange={(e) => setToleranceMinutes(Number(e.target.value))}
            required
            min="0"
          />
        </div>

        <div>
          <label
            htmlFor="basePrice"
            className="mb-1 block font-medium text-gray-700 text-sm"
          >
            Valor até 3 Horas (R$)
          </label>
          <input
            id="basePrice"
            type="number"
            step="0.01"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={basePrice}
            onChange={(e) => setBasePrice(Number(e.target.value))}
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
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            required
            min="0"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" onClick={onClose} variant="secondary">
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
