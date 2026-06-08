import { beforeEach, describe, expect, it, spyOn } from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { antennaService } from "../AntennaService";
import { useAntennas } from "./useAntennas";

const getAntennasSpy = spyOn(antennaService, "getAntennas");

describe("useAntennas hook", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    getAntennasSpy.mockClear();
  });

  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  it("should fetch and return antenna data", async () => {
    const mockResult = [
      {
        id: "antenna-id",
        name: "Antena 1",
        status: "On" as const,
        sensibility: -50,
        power: 28.0,
      },
    ];
    getAntennasSpy.mockResolvedValueOnce(mockResult);

    const { result } = renderHook(() => useAntennas(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getAntennasSpy).toHaveBeenCalled();
    expect(result.current.data).toEqual(mockResult);
  });
});
