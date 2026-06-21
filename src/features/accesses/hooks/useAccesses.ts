import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { accessesService } from "../AccessesService";
import type { AccessDto, AccessTypeEnum } from "../dtos";

type UseAccessesOptions = Omit<
  UseQueryOptions<AccessDto[], Error>,
  "queryKey" | "queryFn"
>;

export function useAccesses(
  accessType?: AccessTypeEnum,
  options?: UseAccessesOptions,
) {
  return useQuery<AccessDto[], Error>({
    queryKey: ["accesses", accessType ?? "all"],
    queryFn: () => accessesService.getAccesses(accessType),
    ...options,
  });
}
