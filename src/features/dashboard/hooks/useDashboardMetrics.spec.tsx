import { beforeEach, describe, expect, it, spyOn } from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { DashboardMetricsDto } from "../dtos/dashboardMetricsDto";
import { dashboardService } from "../DashboardService";
import { useDashboardMetrics } from "./useDashboardMetrics";

const getMetricsSpy = spyOn(dashboardService, "getMetrics");

const mockMetrics: DashboardMetricsDto = {
  entriesLastHour: 10,
  exitsLastHour: 5,
  peakEntryTime: "14:00",
  peakHourEntries: 10,
};

describe("useDashboardMetrics hook", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    getMetricsSpy.mockClear();
  });

  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  it("should return dashboard metrics data successfully", async () => {
    getMetricsSpy.mockResolvedValueOnce(mockMetrics);

    const { result } = renderHook(() => useDashboardMetrics(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockMetrics);
    expect(getMetricsSpy).toHaveBeenCalledTimes(1);
  });

  it("should expose error state when the service query fails", async () => {
    getMetricsSpy.mockRejectedValueOnce(new Error("Request failed"));

    const { result } = renderHook(() => useDashboardMetrics(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(getMetricsSpy).toHaveBeenCalledTimes(1);
  });
});
