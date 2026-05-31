import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { dashboardService } from "../DashboardService";
import type { DashboardMetricsDto } from "../dtos/dashboardMetricsDto";

type UseDashboardMetricsOptions = Omit<
  UseQueryOptions<DashboardMetricsDto, Error>,
  "queryKey" | "queryFn"
>;

export function useDashboardMetrics(options?: UseDashboardMetricsOptions) {
  return useQuery<DashboardMetricsDto, Error>({
    queryKey: ["dashboard", "metrics"],
    queryFn: () => dashboardService.getMetrics(),
    ...options,
  });
}
