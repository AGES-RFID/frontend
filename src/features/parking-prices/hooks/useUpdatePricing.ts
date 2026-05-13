import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateParkingPricesDto } from "../dtos/parkingPricesDto";
import { parkingPricesService } from "../ParkingPricesService";

export function useUpdatePricing() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, UpdateParkingPricesDto>({
    mutationFn: (updateDto) => parkingPricesService.updatePricing(updateDto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pricing"] });
    },
  });
}
