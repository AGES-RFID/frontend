import { z } from "zod";

export const timeSeriesPointSchema = z.object({
  timestamp: z.string(),
  count: z.number(),
});

export type TimeSeriesPointDto = z.infer<typeof timeSeriesPointSchema>;

export const timeSeriesSchema = z.object({
  key: z.string(),
  points: z.array(timeSeriesPointSchema),
});

export type TimeSeriesDto = z.infer<typeof timeSeriesSchema>;

export const timeseriesResponseSchema = z.object({
  from: z.string(),
  to: z.string(),
  series: z.array(timeSeriesSchema),
});

export type TimeseriesResponseDto = z.infer<typeof timeseriesResponseSchema>;
