import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardService } from "../DashboardService";
import type { UpdateOccupancyLimitDto } from "../dtos/occupancyDto";

export function useUpdateOccupancyLimit() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, UpdateOccupancyLimitDto>({
    mutationFn: (dto) => dashboardService.updateOccupancyLimit(dto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["occupancy"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
