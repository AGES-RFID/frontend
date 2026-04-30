import type * as React from "react";
import { Button } from "../button";
import { formatCurrency } from "../../../utils/formatting";

export interface BalanceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  balance: number;
  onAddBalance: () => void;
}

export function BalanceCard({
  className,
  balance,
  onAddBalance,
  ...props
}: BalanceCardProps) {
  return (
    <div
      className={`flex w-full max-w-sm flex-col items-center justify-center gap-4 rounded-2xl p-8 shadow-sm bg-baby-blue${className ? ` ${className}` : ""}`}
      {...props}
    >
      <span className="font-semibold text-dark-blue text-lg">Seu saldo:</span>

      <h2 className="my-2 font-bold text-5xl text-teal tracking-tight">
        {formatCurrency(balance)}
      </h2>
      <Button
        onClick={onAddBalance}
        className="mt-2 w-full max-w-[200px] rounded-lg bg-dark-blue text-white hover:bg-dark-blue-75 active:bg-dark-blue-50"
      >
        Adicionar saldo
      </Button>
    </div>
  );
}
