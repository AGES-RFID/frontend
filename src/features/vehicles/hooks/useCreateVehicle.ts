import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateVehicleDto } from "../dtos";
import { vehicleService } from "../VehicleService";

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (createVehicleDto: CreateVehicleDto) =>
      vehicleService.createVehicle(createVehicleDto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
