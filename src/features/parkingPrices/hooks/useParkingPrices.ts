import { useQuery } from "@tanstack/react-query";
import { parkingPricesService } from "../ParkingPricesService";

export function useParkingPrices() {
  return useQuery({
    queryFn: () => parkingPricesService.listParkingPrices(),
    queryKey: ["parking-prices"],
  });
}
