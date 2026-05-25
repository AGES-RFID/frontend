import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { accessesService } from "../AccessesService";
import type { AccessDto } from "../dtos";

type UseRecentExitsOptions = Omit<
  UseQueryOptions<AccessDto[], Error>,
  "queryKey" | "queryFn"
>;

export function useRecentExits(options?: UseRecentExitsOptions) {
  return useQuery<AccessDto[], Error>({
    queryKey: ["accesses", "recent-exits"],
    queryFn: () => accessesService.getRecentExits(),
    ...options,
  });
}
