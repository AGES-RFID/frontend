import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ParkingPricesDto, UpdateParkingPriceDto } from "../dtos";
import { parkingPricesService } from "../ParkingPricesService";

export type UpdateParkingPriceVariables = {
  parkingPriceId: string;
  updateParkingPriceDto: UpdateParkingPriceDto;
};

export function useUpdateParkingPrice() {
  const queryClient = useQueryClient();

  return useMutation<ParkingPricesDto, Error, UpdateParkingPriceVariables>({
    mutationFn: ({ parkingPriceId, updateParkingPriceDto }) =>
      parkingPricesService.updateParkingPrice(
        parkingPriceId,
        updateParkingPriceDto,
      ),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["parking-prices"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["parking-prices", variables.parkingPriceId],
      });
    },
  });
}
