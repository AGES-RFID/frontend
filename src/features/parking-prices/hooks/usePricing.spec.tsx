import { describe, expect, it, spyOn, beforeEach } from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ParkingPricesDto } from "../dtos/parkingPricesDto";

import { parkingPricesService } from "../ParkingPricesService";
import { usePricing } from "./usePricing";

const getPricingSpy = spyOn(parkingPricesService, "getPricing");

const mockPricing: ParkingPricesDto = {
  parkingPriceId: "pricing-id",
  toleranceMinutes: 15,
  basePrice: 10,
  thresholdMinutes: 180,
  hourlyRate: 5,
};

describe("usePricing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    getPricingSpy.mockClear();
  });

  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
  it("should return pricing data", async () => {
    getPricingSpy.mockResolvedValueOnce(mockPricing);

    const { result } = renderHook(() => usePricing(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockPricing);
    expect(getPricingSpy).toHaveBeenCalledTimes(1);
  });

  it("should expose errors when the query fails", async () => {
    getPricingSpy.mockRejectedValueOnce(new Error("Request failed"));

    const { result } = renderHook(() => usePricing(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
