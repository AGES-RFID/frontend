import { z } from "zod";
import { tagSchema } from "./tagDto";

export const bulkCreateTagsResultSchema = z.object({
  createdCount: z.number(),
  errorCount: z.number(),
  createdTags: z.array(tagSchema),
  errors: z.array(z.string()),
});

export type BulkCreateTagsResultDto = z.infer<
  typeof bulkCreateTagsResultSchema
>;
