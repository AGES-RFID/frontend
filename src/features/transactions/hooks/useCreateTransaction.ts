import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateTransactionDto } from "../dtos";
import { transactionService } from "../TransactionService";

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (createTransactionDto: CreateTransactionDto) =>
      transactionService.createTransaction(createTransactionDto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
