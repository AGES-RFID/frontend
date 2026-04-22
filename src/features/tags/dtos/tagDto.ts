import { z } from "zod";

export const tagSchema = z.object({
  tagId: z.string(),
  status: z.string(),
  vehicleId: z.string().uuid().nullable().optional(),
});

export type TagDto = z.infer<typeof tagSchema>;
