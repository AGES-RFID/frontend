import type z from "zod";
import { vehicleListSchema } from "@/features/vehicles/dtos";
import { userSchema } from "./userDto";

export const userWithVehiclesSchema = userSchema.extend({
  vehicles: vehicleListSchema,
});

export type UserWithVehiclesDto = z.infer<typeof userWithVehiclesSchema>;
