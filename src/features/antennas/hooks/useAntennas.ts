import { useQuery } from "@tanstack/react-query";
import type { AntennaDto } from "../dtos";
import { antennaService } from "../AntennaService";

export function useAntennas() {
  return useQuery<AntennaDto[], Error>({
    queryKey: ["antennas"],
    queryFn: () => antennaService.getAntennas(),
  });
}
