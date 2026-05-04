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
}

export const transactionService = new TransactionService(api);
