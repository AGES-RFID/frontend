import { type ChangeEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatting";

type AddCreditModalProps = {
  isOpen: boolean;
  clientBalance: number;
  onClose: () => void;
  onConfirm: (value: number) => Promise<void> | void;
};

const suggestedValuesInCents = [500, 1000, 1500];

export function AddCreditModal({
  isOpen,
  clientBalance,
  onClose,
  onConfirm,
}: Readonly<AddCreditModalProps>) {
  const [amountInCents, setAmountInCents] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAmountInCents(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const hasValidAmount = amountInCents !== null && amountInCents > 0;
  const clientBalanceInCents = Math.round(clientBalance * 100);

  function handleAmountChange(event: ChangeEvent<HTMLInputElement>) {
    const onlyDigits = event.target.value.replace(/\D/g, "");

    if (!onlyDigits) {
      setAmountInCents(null);
      return;
    }

    setAmountInCents(Number(onlyDigits));
  }

  function handleSuggestedValue(valueInCents: number) {
    setAmountInCents((currentAmount) => (currentAmount ?? 0) + valueInCents);
  }

  function handleConfirm() {
    if (!hasValidAmount || amountInCents === null) return;

    void onConfirm(amountInCents / 100);
  }

  function handleClose() {
    setAmountInCents(null);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      data-testid="add-credit-modal-backdrop"
    >
      <section
        aria-modal="true"
        aria-labelledby="add-credit-modal-title"
        className="w-full max-w-sm rounded-2xl bg-white px-5 py-5 shadow-xl"
        role="dialog"
      >
        <h2
          className="text-center font-bold text-dark-blue text-xl md:text-2xl"
          id="add-credit-modal-title"
        >
          Adicionar Crédito
        </h2>

        <div className="mt-6 text-center">
          <p className="font-bold text-gray text-sm">Saldo atual</p>

          <strong
            className="mt-2 block font-bold text-3xl text-teal md:text-4xl"
            data-testid="client-balance"
          >
            {formatCurrency(clientBalanceInCents / 100)}
          </strong>
        </div>

        <div className="mx-auto mt-5 w-full max-w-xs rounded-xl bg-baby-blue px-4 py-4">
          <label
            className="block text-center font-bold text-gray text-sm"
            htmlFor="credit-value"
          >
            Adicionar valor
          </label>

          <input
            aria-label="Adicionar valor"
            className={cn(
              "mx-auto mt-3 w-11/12 border-gray border-b-2 bg-transparent text-center font-bold text-dark-blue text-xl",
              "outline-none placeholder:text-gray focus:border-dark-blue",
            )}
            data-testid="credit-value-input"
            id="credit-value"
            inputMode="numeric"
            onChange={handleAmountChange}
            placeholder="0,00"
            value={
              amountInCents === null ? "" : formatCurrency(amountInCents / 100)
            }
          />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {suggestedValuesInCents.map((valueInCents) => (
            <Button
              className="w-full whitespace-nowrap font-bold"
              key={valueInCents}
              onClick={() => handleSuggestedValue(valueInCents)}
              size="sm"
              type="button"
              variant="borderless"
            >
              + {formatCurrency(valueInCents / 100)}
            </Button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button
            className="font-bold text-black"
            onClick={handleClose}
            size="md"
            type="button"
            variant="borderless"
          >
            Cancelar
          </Button>

          <Button
            className="font-bold"
            disabled={!hasValidAmount}
            onClick={handleConfirm}
            size="md"
            type="button"
          >
            Confirmar
          </Button>
        </div>
      </section>
    </div>
  );
}
