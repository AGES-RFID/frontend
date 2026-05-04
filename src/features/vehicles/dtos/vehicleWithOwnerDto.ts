import type { z } from "zod";
import { userSchema } from "@/features/users/dtos/userDto";
import { vehicleSchema } from "./vehicleDto";

export const vehicleWithOwnerSchema = vehicleSchema.extend({
  owner: userSchema,
});

export type VehicleWithOwnerDto = z.infer<typeof vehicleWithOwnerSchema>;
