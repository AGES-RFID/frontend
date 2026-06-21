import { z } from "zod";
import { accessDtoSchema } from "@/features/accesses/dtos/accessDto";

export const dashboardMetricsSchema = z.object({
  entriesLastHour: z.number(),
  exitsLastHour: z.number(),
  peakEntryTime: z.string().nullable(),
  peakHourEntries: z.number(),
  currentOccupancy: z.number(),
  maxOccupancy: z.number(),
  accesses: z.array(accessDtoSchema),
  updatedAt: z.string(),
});

export type DashboardMetricsDto = z.infer<typeof dashboardMetricsSchema>;
