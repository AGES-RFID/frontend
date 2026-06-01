import { afterAll, beforeEach, describe, expect, it, spyOn } from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type { UserDto } from "@/features/users/dtos";
import * as authHooks from "../hooks";
import { authService } from "../AuthService";

const useMeSpy = spyOn(authHooks, "useMe");

const { AuthContextProvider, useAuthContext } = await import("./AuthContext");

function createWrapper() {
  const queryClient = new QueryClient();

  return {
    queryClient,
    Wrapper: function Wrapper({ children }: { children: React.ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          <AuthContextProvider>{children}</AuthContextProvider>
        </QueryClientProvider>
      );
    },
  };
}

describe("AuthContext", () => {
  beforeEach(() => {
    useMeSpy.mockReset();
  });

  afterAll(() => {
    useMeSpy.mockRestore();
  });

  it("throws when useAuthContext is called outside AuthContextProvider", () => {
    expect(() => renderHook(() => useAuthContext())).toThrow(
      "useAuthContext must be called within an AuthContextProvider",
    );
  });

  it("exposes isLoading and currentUser from useMe", () => {
    const user: UserDto = {
      userId: "550e8400-e29b-41d4-a716-446655440000",
      name: "Jane Doe",
      email: "jane@example.com",
      role: "admin",
      balance: 10,
    };

    useMeSpy.mockReturnValue({
      isLoading: true,
      isFetching: false,
      data: user,
    } as never);

    const { Wrapper } = createWrapper();

    const { result } = renderHook(() => useAuthContext(), { wrapper: Wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.currentUser).toEqual(user);
  });

  it("sets currentUser as undefined when useMe has no data", () => {
    useMeSpy.mockReturnValue({
      isLoading: false,
      isFetching: false,
      data: null,
    } as never);

    const { Wrapper } = createWrapper();

    const { result } = renderHook(() => useAuthContext(), { wrapper: Wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.currentUser).toBeUndefined();
  });

  it("proxies logout to authService and resets me query", async () => {
    useMeSpy.mockReturnValue({
      isLoading: false,
      isFetching: false,
      data: null,
    } as never);

    const logoutSpy = spyOn(authService, "logout").mockImplementation(() => {});
    const { queryClient, Wrapper } = createWrapper();
    const resetQueriesSpy = spyOn(queryClient, "resetQueries");

    const { result } = renderHook(() => useAuthContext(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.logout();
    });

    expect(logoutSpy).toHaveBeenCalledTimes(1);
    expect(resetQueriesSpy).toHaveBeenCalledWith({ queryKey: ["me"] });

    logoutSpy.mockRestore();
    resetQueriesSpy.mockRestore();
  });
});
