import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { dashboardService } from "../DashboardService";
import type { GraphData } from "@/components/ui/graph/types";

type UseVehicleFlowOptions = Omit<
  UseQueryOptions<GraphData[], Error>,
  "queryKey" | "queryFn"
>;

export function useVehicleFlow(options?: UseVehicleFlowOptions) {
  return useQuery<GraphData[], Error>({
    queryKey: ["dashboard", "vehicle-flow"],
    queryFn: () => dashboardService.getVehicleFlow(),
    refetchInterval: 60_000,
    ...options,
  });
}
