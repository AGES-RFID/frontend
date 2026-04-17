import { useQuery } from "@tanstack/react-query";
import { vehicleService } from "../VehicleService";

export function useVehicles() {
  return useQuery({
    queryFn: () => vehicleService.listVehicles({ includeOwner: true }),
    queryKey: ["admin-vehicles", { include: "users" }],
  });
}
