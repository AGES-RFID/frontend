import { z } from "zod";

export const createTagSchema = z.object({
  tid: z.string().min(1),
  epc: z.string().min(1),
});

export type CreateTagDto = z.infer<typeof createTagSchema>;
