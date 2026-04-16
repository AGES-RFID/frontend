import { z } from "zod";
import { vehicleSchema } from "./vehicleDto";

export const vehicleListSchema = z.array(vehicleSchema);

export type VehicleListDto = z.infer<typeof vehicleListSchema>;
