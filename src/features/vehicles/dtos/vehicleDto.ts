import { z } from "zod";

export const vehicleSchema = z.object({
  vehicleId: z.uuid(),
  userId: z.uuid(),
  plate: z.string(),
  brand: z.string(),
  model: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type VehicleDto = z.infer<typeof vehicleSchema>;
