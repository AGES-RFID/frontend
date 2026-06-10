import { z } from "zod";
import { vehicleSchema } from "@/features/vehicles/dtos";

export const occupancySchema = z.object({
  currentOccupancy: z.number(),
  maxOccupancy: z.number(),
  occupancyPercentage: z.number(),
  vehicles: z.array(vehicleSchema),
});

export type OccupancyDto = z.infer<typeof occupancySchema>;

export const updateOccupancyLimitSchema = z.object({
  maxOccupancy: z.number().int().min(1),
});

export type UpdateOccupancyLimitDto = z.infer<
  typeof updateOccupancyLimitSchema
>;
