import { useState } from "react";
import { BalanceCard } from "@/components/ui/balance-card";
import { toast } from "@/components/ui/toast";
import { AccessCard } from "@/features/accesses/components/access-card/AccessCard";
import { useMe } from "@/features/auth/hooks/useMe";
import { AddCreditModal } from "@/features/transactions/components/add-credit-modal";
import { useCreateTransaction } from "@/features/transactions/hooks/useCreateTransaction";
import { useMyTransactions } from "@/features/transactions/hooks/useMyTransactions";
import { PricingTable } from "@/features/users/components/PricingTable";
import { formatCurrency } from "@/utils/formatting";

export function Payment() {
  const meQuery = useMe();
  const transactionsQuery = useMyTransactions();
  const createTransactionMutation = useCreateTransaction();

  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);

  async function handleAddCredit(value: number) {
    createTransactionMutation.mutate(
      {
        amount: value,
        description: "Crédito adicionado pelo usuário",
      },
      {
        onSuccess: () => {
          toast.success(
            `Crédito adicionado! R$ ${formatCurrency(value)} foram adicionados ao seu saldo.`,
          );
          setIsCreditModalOpen(false);
          meQuery.refetch();
          transactionsQuery.refetch();
        },
        onError: () => {
          toast.error("Ocorreu um erro ao adicionar crédito. Tente novamente.");
        },
      },
    );
  }

  if (meQuery.isLoading) {
    return (
      <div className="mx-auto min-h-screen max-w-xl space-y-6 py-10">
        <h1 className="mb-12 animate-pulse text-center font-bold text-4xl text-dark-blue">
          Carregando...
        </h1>
      </div>
    );
  }

  if (meQuery.isError || !meQuery.data) {
    return (
      <div className="mx-auto min-h-screen max-w-xl space-y-6 py-10">
        <h1 className="mb-12 text-center font-bold text-4xl text-dark-blue">
          Ocorreu um erro ao carregar seus dados.
        </h1>
      </div>
    );
  }

  return (
    <>
      <main className="mx-auto min-h-screen max-w-xl space-y-8 px-6 py-10">
        <h1 className="text-center font-bold text-4xl text-dark-blue">
          Pagamentos
        </h1>

        <section className="flex w-full justify-center">
          <BalanceCard
            balance={meQuery.data.balance || 0}
            onAddBalance={() => setIsCreditModalOpen(true)}
          />
        </section>

        <section className="w-full">
          <h2 className="mb-4 font-bold text-dark-blue text-xl">
            Tabela de Preços
          </h2>
          <PricingTable className="w-full" />
        </section>

        <section className="w-full">
          <h2 className="mb-4 font-bold text-dark-blue text-xl">
            Histórico de Movimentações
          </h2>

          <div className="flex flex-col gap-4">
            {transactionsQuery.isLoading && (
              <p className="animate-pulse text-gray text-sm">
                Carregando histórico...
              </p>
            )}

            {transactionsQuery.isError && (
              <p className="text-red text-sm">
                Ocorreu um erro ao carregar as movimentações.
              </p>
            )}

            {transactionsQuery.isSuccess &&
              transactionsQuery.data.length === 0 && (
                <p className="text-gray text-sm">
                  Nenhuma movimentação encontrada.
                </p>
              )}

            {transactionsQuery.isSuccess &&
              transactionsQuery.data.map((tx) => {
                const dateObj = new Date(tx.createdAt);

                const dateStr = dateObj.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });

                const hourStr = dateObj.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                // Attempt to parse vehicle plate from description if it's a withdrawal and has a format like "(placa ABC1234)"
                let tagId = "-";
                if (tx.transactionType === "withdrawal") {
                  const match = tx.description.match(/placa\s+([A-Z0-9]+)/i);
                  if (match) {
                    tagId = match[1] || "-";
                  }
                }

                return (
                  <AccessCard
                    key={tx.transactionId}
                    type={tx.transactionType}
                    date={dateStr}
                    hour={hourStr}
                    amount={tx.amount}
                    tagId={tagId}
                  />
                );
              })}
          </div>
        </section>
      </main>

      <AddCreditModal
        isOpen={isCreditModalOpen}
        clientBalance={meQuery.data.balance || 0}
        onClose={() => setIsCreditModalOpen(false)}
        onConfirm={handleAddCredit}
      />
    </>
  );
}
