import { z } from "zod";

export const createTransactionDto = z.object({
  userId: z.string().optional(),
  description: z.string(),
  amount: z.number(),
});

export type CreateTransactionDto = z.infer<typeof createTransactionDto>;
