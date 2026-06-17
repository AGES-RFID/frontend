import { z } from "zod";
import { antennaStatusSchema } from "./antennaStatus";

export const antennaSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: antennaStatusSchema,
  sensibility: z.number().nullable(),
  power: z.number().nullable(),
});

export type AntennaDto = z.infer<typeof antennaSchema>;
