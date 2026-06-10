import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { dashboardService } from "../DashboardService";
import type { OccupancyDto } from "../dtos/occupancyDto";

type UseOccupancyOptions = Omit<
  UseQueryOptions<OccupancyDto, Error>,
  "queryKey" | "queryFn"
>;

export function useOccupancy(options?: UseOccupancyOptions) {
  return useQuery<OccupancyDto, Error>({
    queryKey: ["occupancy"],
    queryFn: () => dashboardService.getOccupancy(),
    ...options,
  });
}
