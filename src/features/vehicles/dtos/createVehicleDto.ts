import { z } from "zod";

export const createVehicleSchema = z.object({
  userId: z.string().uuid(),
  plate: z.string(),
  brand: z.string(),
  model: z.string(),
});

export type CreateVehicleDto = z.infer<typeof createVehicleSchema>;
