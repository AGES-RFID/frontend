import { describe, expect, it, mock, beforeEach, spyOn } from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { UpdateParkingPricesDto } from "../dtos/parkingPricesDto";

import { parkingPricesService } from "../ParkingPricesService";
import { useUpdatePricing } from "./useUpdatePricing";

const updatePricingSpy = spyOn(parkingPricesService, "updatePricing");

describe("useUpdatePricing", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    updatePricingSpy.mockClear();
  });

  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  it("should mutate pricing data and invalidate queries", async () => {
    updatePricingSpy.mockResolvedValueOnce(undefined);

    const invalidateQueriesSpy = mock(async () => {});
    queryClient.invalidateQueries = invalidateQueriesSpy;

    const { result } = renderHook(() => useUpdatePricing(), {
      wrapper: createWrapper(),
    });

    const updateDto: UpdateParkingPricesDto = {
      toleranceMinutes: 20,
      basePrice: 15,
      hourlyRate: 8,
    };

    result.current.mutate(updateDto);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(updatePricingSpy).toHaveBeenCalledWith(updateDto);
    expect(updatePricingSpy).toHaveBeenCalledTimes(1);
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["pricing"],
    });
  });

  it("should expose errors when the mutation fails", async () => {
    updatePricingSpy.mockRejectedValueOnce(new Error("Mutation failed"));

    const { result } = renderHook(() => useUpdatePricing(), {
      wrapper: createWrapper(),
    });

    const updateDto: UpdateParkingPricesDto = {
      toleranceMinutes: 20,
      basePrice: 15,
      hourlyRate: 8,
    };

    result.current.mutate(updateDto);

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
