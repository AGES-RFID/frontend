import { beforeEach, describe, expect, it, mock, spyOn } from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { UpdateAntennaDto } from "../dtos";
import { antennaService } from "../AntennaService";
import { useUpdateAntenna } from "./useUpdateAntenna";

const updateAntennaSpy = spyOn(antennaService, "updateAntenna");

describe("useUpdateAntenna", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    updateAntennaSpy.mockClear();
  });

  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  it("should mutate antenna data and invalidate queries", async () => {
    const mockResult = {
      id: "antenna-id",
      name: "Antena 1",
      status: "On" as const,
      sensibility: -50,
      power: 28.0,
    };
    updateAntennaSpy.mockResolvedValueOnce(mockResult);

    const invalidateQueriesSpy = mock(async () => {});
    queryClient.invalidateQueries = invalidateQueriesSpy;

    const { result } = renderHook(() => useUpdateAntenna(), {
      wrapper: createWrapper(),
    });

    const updateDto: UpdateAntennaDto = {
      status: "On",
      sensibility: -50,
      power: 28.0,
    };

    result.current.mutate({
      antennaId: "antenna-id",
      updateDto,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(updateAntennaSpy).toHaveBeenCalledWith("antenna-id", updateDto);
    expect(updateAntennaSpy).toHaveBeenCalledTimes(1);
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["antennas"],
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["system"],
    });
  });
});
