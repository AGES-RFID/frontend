import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateParkingPricesDto } from "../dtos/parkingPricesDto";
import { parkingPricesService } from "../ParkingPricesService";

type UpdatePricingVariables = {
  parkingPriceId: string;
  updateDto: UpdateParkingPricesDto;
};

export function useUpdatePricing() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, UpdatePricingVariables>({
    mutationFn: ({ parkingPriceId, updateDto }) =>
      parkingPricesService.updatePricing(parkingPriceId, updateDto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pricing"] });
    },
  });
}
