import { useQuery } from "@tanstack/react-query";
import { transactionService } from "../TransactionService";

export function useMyTransactions() {
  return useQuery({
    queryKey: ["my-transactions"],
    queryFn: async () => {
      return transactionService.myTransactions();
    },
  });
}
