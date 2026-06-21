import { describe, expect, it, spyOn, beforeEach } from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { dashboardService } from "../DashboardService";
import { useDashboard } from "./useDashboard";

const getDashboardSpy = spyOn(dashboardService, "getDashboard");

const mockDashboard = {
  entriesLastHour: 5,
  exitsLastHour: 2,
  peakEntryTime: "14:00",
  peakHourEntries: 12,
  currentOccupancy: 3,
  maxOccupancy: 100,
  accesses: [],
  updatedAt: "2026-06-20T20:00:00Z",
};

describe("useDashboard", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    getDashboardSpy.mockClear();
  });

  const createWrapper =
    () =>
    ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

  it("should return dashboard data on success", async () => {
    getDashboardSpy.mockResolvedValueOnce(mockDashboard);

    const { result } = renderHook(() => useDashboard(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockDashboard);
    expect(getDashboardSpy).toHaveBeenCalledTimes(1);
  });

  it("should expose error when query fails", async () => {
    getDashboardSpy.mockRejectedValueOnce(new Error("Request failed"));

    const { result } = renderHook(() => useDashboard(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("should use queryKey [dashboard]", async () => {
    getDashboardSpy.mockResolvedValueOnce(mockDashboard);

    renderHook(() => useDashboard(), { wrapper: createWrapper() });

    await waitFor(() =>
      expect(queryClient.getQueryData(["dashboard"])).toBeDefined(),
    );
  });
});