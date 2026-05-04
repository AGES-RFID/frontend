import z from "zod";
import { transactionTypeEnumSchema } from "./transactionTypeEnum";

export const transactionDtoSchema = z.object({
  transactionId: z.string(),
  userId: z.string().optional(),
  transactionType: transactionTypeEnumSchema,
  description: z.string(),
  amount: z.number(),
  createdAt: z.string(),
});

export type TransactionDto = z.infer<typeof transactionDtoSchema>;
