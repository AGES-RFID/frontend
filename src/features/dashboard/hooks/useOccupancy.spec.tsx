import { describe, expect, it, spyOn, beforeEach } from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { OccupancyDto } from "../dtos/occupancyDto";
import { dashboardService } from "../DashboardService";
import { useOccupancy } from "./useOccupancy";

const getOccupancySpy = spyOn(dashboardService, "getOccupancy");

const mockOccupancy: OccupancyDto = {
  currentOccupancy: 3,
  maxOccupancy: 100,
  occupancyPercentage: 3.0,
  vehicles: [],
};

describe("useOccupancy", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    getOccupancySpy.mockClear();
  });

  const createWrapper =
    () =>
    ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

  it("should return occupancy data on success", async () => {
    getOccupancySpy.mockResolvedValueOnce(mockOccupancy);

    const { result } = renderHook(() => useOccupancy(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockOccupancy);
    expect(getOccupancySpy).toHaveBeenCalledTimes(1);
  });

  it("should expose error when query fails", async () => {
    getOccupancySpy.mockRejectedValueOnce(new Error("Request failed"));

    const { result } = renderHook(() => useOccupancy(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("should use queryKey [occupancy]", async () => {
    getOccupancySpy.mockResolvedValueOnce(mockOccupancy);

    renderHook(() => useOccupancy(), { wrapper: createWrapper() });

    await waitFor(() =>
      expect(queryClient.getQueryData(["occupancy"])).toBeDefined(),
    );
  });
});
