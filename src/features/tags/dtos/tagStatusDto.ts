import { z } from "zod";

export const tagStatusSchema = z.enum(["AVAILABLE", "IN_USE", "INACTIVE"]);

export type TagStatus = z.infer<typeof tagStatusSchema>;
