import z from "zod";
import { accessTypeEnumSchema } from "./accessTypeEnum";

export const accessDtoSchema = z.object({
  accessId: z.string().optional(),
  tagId: z.string().optional(),
  type: accessTypeEnumSchema.optional(),
  timestamp: z.string().optional(),
  plate: z.string().nullable().optional(),
  value: z.number().nullable().optional(),
});

export type AccessDto = z.infer<typeof accessDtoSchema>;
