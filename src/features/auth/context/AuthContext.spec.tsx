import { afterAll, beforeEach, describe, expect, it, spyOn } from "bun:test";
import { renderHook } from "@testing-library/react";
import type { UserDto } from "@/features/users/dtos";
import * as authHooks from "../hooks";

const useMeSpy = spyOn(authHooks, "useMe");

const { AuthContextProvider, useAuthContext } = await import("./AuthContext");

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

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContextProvider>{children}</AuthContextProvider>
    );

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.currentUser).toEqual(user);
  });

  it("sets currentUser as undefined when useMe has no data", () => {
    useMeSpy.mockReturnValue({
      isLoading: false,
      isFetching: false,
      data: null,
    } as never);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContextProvider>{children}</AuthContextProvider>
    );

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.currentUser).toBeUndefined();
  });
});
