import { z } from "zod";
import { tagStatusSchema } from "./tagStatusDto";

export const tagListItemSchema = z.object({
  id: z.string(),
  userName: z.string().nullable(),
  plate: z.string().nullable(),
  status: tagStatusSchema,
});

export const tagListSchema = z.array(tagListItemSchema);

export type TagListItemDto = z.infer<typeof tagListItemSchema>;
