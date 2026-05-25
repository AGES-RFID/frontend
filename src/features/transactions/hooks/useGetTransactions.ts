import { useQuery } from "@tanstack/react-query";
import { transactionService } from "../TransactionService";

export function useGetTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: () => transactionService.myTransactions(),
  });
}
