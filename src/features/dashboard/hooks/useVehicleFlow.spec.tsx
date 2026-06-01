import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { dashboardService } from "../DashboardService";
import type { GraphData } from "@/components/ui/graph/types";
import { useVehicleFlow } from "./useVehicleFlow";

const getVehicleFlowSpy = spyOn(dashboardService, "getVehicleFlow");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

afterEach(() => {
  cleanup();
});

describe("useVehicleFlow", () => {
  beforeEach(() => {
    queryClient.clear();
    getVehicleFlowSpy.mockClear();
  });

  it("should return vehicle flow data on success", async () => {
    const mockData: GraphData[] = [
      { hour: "10", entry: 5, exit: 3 },
      { hour: "11", entry: 12, exit: 8 },
    ];

    getVehicleFlowSpy.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useVehicleFlow(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it("should expose error when request fails", async () => {
    getVehicleFlowSpy.mockRejectedValueOnce(new Error("Request failed"));

    const { result } = renderHook(() => useVehicleFlow(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("should use the correct query key", async () => {
    getVehicleFlowSpy.mockResolvedValueOnce([]);

    const { result } = renderHook(() => useVehicleFlow(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const cachedData = queryClient.getQueryData(["dashboard", "vehicle-flow"]);
    expect(cachedData).toBeDefined();
  });
});
