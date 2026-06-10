import { z } from "zod";

export const createTagSchema = z.object({
  tid: z
    .string()
    .min(1)
    .regex(/^[0-9a-fA-F]+$/, "TID deve conter apenas caracteres hexadecimais"),
  epc: z
    .string()
    .min(1)
    .regex(/^[0-9a-fA-F]+$/, "EPC deve conter apenas caracteres hexadecimais"),
});

export type CreateTagDto = z.infer<typeof createTagSchema>;
