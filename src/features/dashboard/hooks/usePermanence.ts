import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { dashboardService } from "../DashboardService";
import type { PermanenceDto } from "@/features/vehicles/dtos/permanenceDto";

type UsePermanenceOptions = Omit<
  UseQueryOptions<PermanenceDto[], Error>,
  "queryKey" | "queryFn"
>;

export function usePermanence(options?: UsePermanenceOptions) {
  return useQuery<PermanenceDto[], Error>({
    queryKey: ["permanence"],
    queryFn: () => dashboardService.getPermanence(),
    refetchInterval: 30_000,
    ...options,
  });
}
