import { describe, expect, it, mock, beforeEach, spyOn } from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { UpdateOccupancyLimitDto } from "../dtos/occupancyDto";
import { dashboardService } from "../DashboardService";
import { useUpdateOccupancyLimit } from "./useUpdateOccupancyLimit";

const updateOccupancyLimitSpy = spyOn(dashboardService, "updateOccupancyLimit");

describe("useUpdateOccupancyLimit", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    updateOccupancyLimitSpy.mockClear();
  });

  const createWrapper =
    () =>
    ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

  it("should call updateOccupancyLimit with the correct dto", async () => {
    updateOccupancyLimitSpy.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useUpdateOccupancyLimit(), {
      wrapper: createWrapper(),
    });

    const dto: UpdateOccupancyLimitDto = { maxOccupancy: 150 };
    result.current.mutate(dto);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(updateOccupancyLimitSpy).toHaveBeenCalledWith(dto);
    expect(updateOccupancyLimitSpy).toHaveBeenCalledTimes(1);
  });

  it("should invalidate occupancy query on success", async () => {
    updateOccupancyLimitSpy.mockResolvedValueOnce(undefined);

    const invalidateQueriesSpy = mock(async () => {});
    queryClient.invalidateQueries = invalidateQueriesSpy;

    const { result } = renderHook(() => useUpdateOccupancyLimit(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ maxOccupancy: 200 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["occupancy"],
    });
  });

  it("should expose error when mutation fails", async () => {
    updateOccupancyLimitSpy.mockRejectedValueOnce(new Error("Forbidden"));

    const { result } = renderHook(() => useUpdateOccupancyLimit(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ maxOccupancy: 100 });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
