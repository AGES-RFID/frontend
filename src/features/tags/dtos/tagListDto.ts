import { z } from "zod";

export const tagListItemSchema = z.object({
  id: z.string(),
  userName: z.string().nullable(),
  plate: z.string().nullable(),
  status: z.string(),
});

export const tagListSchema = z.array(tagListItemSchema);

export type TagListItemDto = z.infer<typeof tagListItemSchema>;
