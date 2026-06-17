import { z } from "zod";

export const antennaStatusSchema = z.enum(["On", "Off"]);
export type AntennaStatus = z.infer<typeof antennaStatusSchema>;
