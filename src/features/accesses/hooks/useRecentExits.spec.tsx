import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { accessesService } from "../AccessesService";
import type { AccessDto } from "../dtos";
import { useRecentExits } from "./useRecentExits";

const getRecentExitsSpy = spyOn(accessesService, "getRecentExits");

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

describe("useRecentExits", () => {
  beforeEach(() => {
    queryClient.clear();
    getRecentExitsSpy.mockClear();
  });

  it("should return recent exits data on success", async () => {
    const mockData: AccessDto[] = [
      {
        accessId: "1",
        tagId: "tag-1",
        type: "exit",
        timestamp: "2026-03-12T09:33:00",
        plate: "ABCD1234",
        value: 15,
      },
    ];

    getRecentExitsSpy.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useRecentExits(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it("should expose errors when request fails", async () => {
    getRecentExitsSpy.mockRejectedValueOnce(new Error("Request failed"));

    const { result } = renderHook(() => useRecentExits(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
