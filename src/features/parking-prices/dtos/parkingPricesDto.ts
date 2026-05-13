import { z } from "zod";

export const parkingPricesSchema = z.object({
  parkingPriceId: z.string().uuid(),
  toleranceMinutes: z.number(),
  basePrice: z.number(),
  thresholdMinutes: z.number(),
  hourlyRate: z.number(),
  createdAt: z.string().optional(),
});

export type ParkingPricesDto = z.infer<typeof parkingPricesSchema>;

export const updateParkingPricesSchema = z.object({
  toleranceMinutes: z.number(),
  basePrice: z.number(),
  hourlyRate: z.number(),
});

export type UpdateParkingPricesDto = z.infer<typeof updateParkingPricesSchema>;
