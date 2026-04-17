import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vehicleService } from "../VehicleService";

export type DeleteVehicleVariables = {
  vehicleId: string;
};

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, DeleteVehicleVariables>({
    mutationFn: ({ vehicleId }) => vehicleService.deleteVehicle(vehicleId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
    },
  });
}
