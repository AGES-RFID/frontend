import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { parkingPricesService } from "../ParkingPricesService";
import type { ParkingPricesDto } from "../dtos";

type UseParkingPriceOptions = Omit<
  UseQueryOptions<ParkingPricesDto, Error>,
  "queryKey" | "queryFn"
>;

export function useParkingPrice(
  parkingPriceId: string,
  options?: UseParkingPriceOptions,
) {
  return useQuery<ParkingPricesDto, Error>({
    queryFn: () => parkingPricesService.getParkingPriceById(parkingPriceId),
    queryKey: ["parking-prices", parkingPriceId],
    enabled: !!parkingPriceId,
    ...options,
  });
}
