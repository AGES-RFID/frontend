import { z } from "zod";

export const transactionTypeEnumSchema = z.enum(["deposit", "withdrawal"]);

export type TransactionTypeEnum = z.infer<typeof transactionTypeEnumSchema>;
