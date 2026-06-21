import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { dashboardService } from "../DashboardService";
import type { DashboardMetricsDto } from "../dtos/dashboardMetricsDto";

type UseDashboardOptions = Omit<
  UseQueryOptions<DashboardMetricsDto, Error>,
  "queryKey" | "queryFn"
>;

export function useDashboard(options?: UseDashboardOptions) {
  return useQuery<DashboardMetricsDto, Error>({
    queryKey: ["dashboard"],
    queryFn: () => dashboardService.getDashboard(),
    ...options,
  });
}
