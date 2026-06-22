import { z } from "zod";

export const permanenceSchema = z.object({
  rfidTag: z.string(),
  plate: z.string(),
  minutesParked: z.number(),
});

export type PermanenceDto = z.infer<typeof permanenceSchema>;
