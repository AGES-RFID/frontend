import { type ChangeEvent, useState } from "react";

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      data-testid="add-credit-modal-backdrop"
    >
      <section
        aria-modal="true"
        aria-labelledby="add-credit-modal-title"
        className="w-full max-w-3xl rounded-2xl bg-white px-8 py-10 shadow-xl"
        role="dialog"
      >
        <h2
          className="text-center font-bold text-4xl text-dark-blue md:text-5xl"
          id="add-credit-modal-title"
        >
          Adicionar Crédito
        </h2>

        <div className="mt-8 text-center">
          <p className="font-bold text-2xl text-gray">Saldo atual</p>

          <strong
            className="mt-4 block font-bold text-5xl text-[#00A6A6] md:text-6xl"
            data-testid="client-balance"
          >
            {formatCurrency(clientBalanceInCents / 100)}
          </strong>
        </div>

        <div className="mx-auto mt-8 w-full max-w-xl rounded-xl bg-[#CBD5E1] px-6 py-5">
          <label
            className="block text-center font-bold text-2xl text-gray"
            htmlFor="credit-value"
          >
            Adicionar valor
          </label>

          <input
            aria-label="Adicionar valor"
            className={cn(
              "mt-4 w-full border-gray border-b-4 bg-transparent text-center font-bold text-4xl text-dark-blue",
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

        <div className="mt-8 flex flex-wrap justify-center gap-6 md:gap-10">
          {suggestedValuesInCents.map((valueInCents) => (
            <Button
              className="font-bold text-2xl"
              key={valueInCents}
              onClick={() => handleSuggestedValue(valueInCents)}
              size="lg"
              type="button"
              variant="borderless"
            >
              + {formatCurrency(valueInCents / 100)}
            </Button>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-end gap-4 md:gap-6">
          <Button
            className="font-bold text-2xl text-black"
            onClick={onClose}
            size="lg"
            type="button"
            variant="borderless"
          >
            Cancelar
          </Button>

          <Button
            className="font-bold text-2xl"
            disabled={!hasValidAmount}
            onClick={handleConfirm}
            size="lg"
            type="button"
          >
            Confirmar
          </Button>
        </div>
      </section>
    </div>
  );
}
