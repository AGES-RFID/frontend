import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { ParkingPricesDto } from "../dtos/parkingPricesDto";
import { parkingPricesService } from "../ParkingPricesService";

type UsePricingOptions = Omit<
  UseQueryOptions<ParkingPricesDto, Error>,
  "queryKey" | "queryFn"
>;

export function usePricing(options?: UsePricingOptions) {
  return useQuery<ParkingPricesDto, Error>({
    queryFn: () => parkingPricesService.getPricing(),
    queryKey: ["pricing"],
    ...options,
  });
}
