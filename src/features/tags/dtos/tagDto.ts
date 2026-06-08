import { z } from "zod";

export const tagSchema = z.object({
  tagId: z.string(),
  status: z.string(),
  vehicleId: z.string().uuid().nullable().optional(),
  tid: z.string(),
  epc: z.string(),
});

export type TagDto = z.infer<typeof tagSchema>;
