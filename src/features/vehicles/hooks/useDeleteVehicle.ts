import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserWithVehiclesDto } from "@/features/users/dtos";
import { vehicleService } from "../VehicleService";

export type DeleteVehicleVariables = {
  vehicleId: string;
};

type DeleteVehicleContext = {
  previousMe?: UserWithVehiclesDto;
};

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    unknown,
    DeleteVehicleVariables,
    DeleteVehicleContext
  >({
    onMutate: async ({ vehicleId }) => {
      await queryClient.cancelQueries({ queryKey: ["me"] });

      const previousMe = queryClient.getQueryData<UserWithVehiclesDto>(["me"]);

      if (previousMe) {
        queryClient.setQueryData<UserWithVehiclesDto>(["me"], {
          ...previousMe,
          vehicles: previousMe.vehicles.filter(
            (v) => v.vehicleId !== vehicleId,
          ),
        });
      }

      return { previousMe };
    },
    mutationFn: ({ vehicleId }) => vehicleService.deleteVehicle(vehicleId),
    onError: async (_error, _variables, context) => {
      if (context?.previousMe) {
        queryClient.setQueryData(["me"], context.previousMe);
      }
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] }),
        queryClient.invalidateQueries({ queryKey: ["me"] }),
      ]);
    },
  });
}
