import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { parkingPricesService } from "../ParkingPricesService";
import type { ParkingPricesDto } from "../dtos/parkingPricesDto";

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
