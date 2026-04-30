import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Button } from "../button";

const balanceCardVariants = cva(
  "flex flex-col items-center justify-center rounded-2xl p-8 w-full max-w-sm gap-4 shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-baby-blue",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
export interface BalanceCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof balanceCardVariants> {
  balance: number;
  onAddBalance: () => void;
}

export function BalanceCard({
  className,
  variant,
  balance,
  onAddBalance,
  ...props
}: BalanceCardProps) {
  const formattedBalance = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(balance);

  return (
    <div className={balanceCardVariants({ variant, className })} {...props}>
      <span className="font-semibold text-dark-blue text-lg">Seu saldo:</span>

      <h2 className="my-2 font-bold text-5xl text-teal tracking-tight">
        {formattedBalance}
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
