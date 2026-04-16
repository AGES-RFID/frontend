import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateVehicleDto } from "../dtos";
import { vehicleService } from "../VehicleService";

export type EditVehicleVariables = {
  vehicleId: string;
  updateVehicleDto: Partial<CreateVehicleDto>;
};

export function useEditVehicle() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, EditVehicleVariables>({
    mutationFn: ({ vehicleId, updateVehicleDto }) =>
      vehicleService.editVehicle(vehicleId, updateVehicleDto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
    },
  });
}
