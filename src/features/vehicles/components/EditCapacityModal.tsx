import { useState, useEffect } from "react";

interface EditCapacityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newCapacity: number) => void;
  currentCapacity?: number;
}
export function EditCapacityModal({
  isOpen,
  onClose,
  onConfirm,
  currentCapacity = 100,
}: EditCapacityModalProps) {
  const [capacity, setCapacity] = useState<number | string>(currentCapacity);
  useEffect(() => {
    if (isOpen) {
      setCapacity(currentCapacity);
    }
  }, [isOpen, currentCapacity]);
  if (!isOpen) return null;

  const handleConfirm = () => {
    const parsedValue = Number(capacity);

    if (!Number.isNaN(parsedValue) && parsedValue >= 0) {
      onConfirm(parsedValue);
      onClose();
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-[420px] rounded-xl bg-white p-8 shadow-xl">
        <h2 className="mb-8 text-center font-bold text-2xl text-dark-blue">
          Editar lotação
        </h2>
        <div className="mb-10">
          <label
            htmlFor="capacity-input"
            className="mb-2 block font-bold text-zinc-800"
          >
            Número de vagas
          </label>
          <input
            id="capacity-input"
            type="number"
            min="0"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 p-3 text-lg text-zinc-800 outline-none transition-all focus:border-dark-blue focus:ring-1 focus:ring-dark-blue"
          />
        </div>

        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-bold text-zinc-800 transition-colors hover:text-black"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-lg bg-dark-blue px-6 py-3 font-bold text-white transition-colors hover:bg-dark-blue"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
