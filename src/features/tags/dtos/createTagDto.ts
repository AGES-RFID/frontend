import { z } from "zod";

export const createTagSchema = z.object({
  tagId: z.string().min(1),
});

export type CreateTagDto = z.infer<typeof createTagSchema>;
