import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AntennaDto, UpdateAntennaDto } from "../dtos";
import { antennaService } from "../AntennaService";

type UpdateAntennaVariables = {
  antennaId: string;
  updateDto: UpdateAntennaDto;
};

export function useUpdateAntenna() {
  const queryClient = useQueryClient();

  return useMutation<AntennaDto, Error, UpdateAntennaVariables>({
    mutationFn: ({ antennaId, updateDto }) =>
      antennaService.updateAntenna(antennaId, updateDto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["antennas"] });
      await queryClient.invalidateQueries({ queryKey: ["system"] });
    },
  });
}
