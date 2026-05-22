import { z } from "zod";

export const parkingPricesSchema = z.object({
  parkingPriceId: z.string().uuid(),
  toleranceMinutes: z.number(),
  basePrice: z.number(),
  thresholdMinutes: z.number(),
  hourlyRate: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ParkingPricesDto = z.infer<typeof parkingPricesSchema>;

export const parkingPricesListSchema = z.array(parkingPricesSchema);

export type ParkingPricesListDto = z.infer<typeof parkingPricesListSchema>;
