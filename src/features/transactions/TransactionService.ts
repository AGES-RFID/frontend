import { z } from "zod";
import { type ApiClient, api } from "@/lib/api";
import type { CreateTransactionDto } from "./dtos/createTransactionDto";
import {
  type TransactionDto,
  transactionDtoSchema,
} from "./dtos/transactionDto";

export class TransactionService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionDto> {
    const transaction = await this.apiClient
      .post("transactions", { json: createTransactionDto })
      .json(transactionDtoSchema);

    return transaction;
  }

  async myTransactions(): Promise<TransactionDto[]> {
    const transactions = await this.apiClient
      .get("transactions/me")
      .json(z.array(transactionDtoSchema));

    return transactions;
  }
}

export const transactionService = new TransactionService(api);
