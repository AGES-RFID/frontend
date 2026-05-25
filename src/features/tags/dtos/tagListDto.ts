import { z } from "zod";
import { tagStatusSchema } from "./tagStatusDto";

export const tagListItemSchema = z.object({
  tagId: z.string(),
  tid: z.string(),
  epc: z.string(),
  userName: z.string().nullable(),
  plate: z.string().nullable(),
  status: tagStatusSchema,
});

export const tagListSchema = z.array(tagListItemSchema);

export type TagListItemDto = z.infer<typeof tagListItemSchema>;
