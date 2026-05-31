import { z } from "zod";

export const accessTypeEnumSchema = z.enum(["entry", "exit"]);

export type AccessTypeEnum = z.infer<typeof accessTypeEnumSchema>;
