import { afterAll, describe, expect, it, spyOn } from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { authService } from "../AuthService";
import type { UserWithVehiclesDto } from "@/features/users/dtos";

const meSpy = spyOn(authService, "me");

const { useMe } = await import("./useMe");

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockUserWithVehicles: UserWithVehiclesDto = {
  userId: "550e8400-e29b-41d4-a716-446655440000",
  name: "John Doe",
  email: "john.doe@example.com",
  balance: 0,
  role: "admin",
  vehicles: [],
};

describe("useMe", () => {
  afterAll(() => {
    meSpy.mockRestore();
  });

  it("should return user data", async () => {
    meSpy.mockResolvedValueOnce(mockUserWithVehicles);

    const { result } = renderHook(() => useMe(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockUserWithVehicles);
    expect(meSpy).toHaveBeenCalledTimes(1);
  });

  it("should expose errors when the query fails", async () => {
    meSpy.mockRejectedValueOnce(new Error("Request failed"));

    const { result } = renderHook(() => useMe(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
