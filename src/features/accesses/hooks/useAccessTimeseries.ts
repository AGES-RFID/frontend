import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { accessesService } from "../AccessesService";
import type { TimeseriesResponseDto } from "../dtos";

type UseAccessTimeseriesOptions = Omit<
  UseQueryOptions<TimeseriesResponseDto, Error>,
  "queryKey" | "queryFn"
>;

export function useAccessTimeseries(options?: UseAccessTimeseriesOptions) {
  return useQuery<TimeseriesResponseDto, Error>({
    queryKey: ["accesses", "timeseries"],
    queryFn: () => accessesService.getTimeseries(),
    ...options,
  });
}
