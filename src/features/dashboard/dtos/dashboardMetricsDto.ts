import { z } from "zod";

export const dashboardMetricsSchema = z.object({
  entriesLastHour: z.number(),
  exitsLastHour: z.number(),
  peakEntryTime: z.string().nullable(),
});

export type DashboardMetricsDto = z.infer<typeof dashboardMetricsSchema>;
