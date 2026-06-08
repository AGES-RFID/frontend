import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useUpdateOccupancyLimit } from "../hooks";

interface EditOccupancyLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMaxOccupancy: number;
}

export function EditOccupancyLimitModal({
  isOpen,
  onClose,
  currentMaxOccupancy,
}: EditOccupancyLimitModalProps) {
  const [maxOccupancy, setMaxOccupancy] = useState<number>(currentMaxOccupancy);
  const { mutate: updateLimit, isPending } = useUpdateOccupancyLimit();

  useEffect(() => {
    if (isOpen) setMaxOccupancy(currentMaxOccupancy);
  }, [isOpen, currentMaxOccupancy]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateLimit({ maxOccupancy }, { onSuccess: () => onClose() });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Lotação Máxima">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="maxOccupancy"
            className="mb-1 block font-medium text-gray-700 text-sm"
          >
            Lotação máxima
          </label>
          <input
            id="maxOccupancy"
            type="number"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={maxOccupancy}
            onChange={(e) => setMaxOccupancy(Number(e.target.value))}
            required
            min="1"
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
