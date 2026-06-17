import { z } from "zod";
import { antennaStatusSchema } from "./antennaStatus";

export const updateAntennaSchema = z.object({
  status: antennaStatusSchema,
  sensibility: z.number().nullable(),
  power: z.number().nullable(),
});

export type UpdateAntennaDto = z.infer<typeof updateAntennaSchema>;
