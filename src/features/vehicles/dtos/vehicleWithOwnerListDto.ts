import { z } from "zod";
import { vehicleWithOwnerSchema } from "./vehicleWithOwnerDto";

export const vehicleWithOwnerListSchema = z.array(vehicleWithOwnerSchema);

export type VehicleWithOwnerListDto = z.infer<typeof vehicleWithOwnerListSchema>;
