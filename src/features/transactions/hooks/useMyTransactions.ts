import { useQuery } from "@tanstack/react-query";
import type { TransactionDto } from "../dtos/transactionDto";

// Temporarily returning mock data since the backend endpoint is not implemented yet.
// See Backend Issue #72
export function useMyTransactions() {
  return useQuery({
    queryKey: ["my-transactions"],
    queryFn: async (): Promise<TransactionDto[]> => {
      // Uncomment this when Issue #72 is done and the endpoint exists:
      // import { transactionService } from "../TransactionService";
      // return transactionService.myTransactions();

      return [
        {
          transactionId: "mock-1",
          userId: "user-1",
          transactionType: "deposit",
          description: "Recarga de saldo via PIX",
          amount: 4.5,
          createdAt: new Date().toISOString(),
        },
        {
          transactionId: "mock-2",
          userId: "user-1",
          transactionType: "withdrawal",
          description: "Pagamento de estacionamento (placa BRA2E91)",
          amount: 4.5,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
    },
  });
}
