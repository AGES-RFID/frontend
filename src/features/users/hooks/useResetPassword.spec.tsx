/** biome-ignore-all lint/style/noNonNullAssertion: Needed for array destructuring */
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { type ApiClient, api } from "@/lib/api";
import { jsonResponse } from "/test/utils/makeResponse";
import { AuthService } from "@/features/auth/AuthService";
import * as resetPasswordModule from "./useResetPassword";

const { resetPasswordFn, InvalidCurrentPasswordException, useResetPassword } =
  resetPasswordModule;

const USER_ID = "550e8400-e29b-41d4-a716-446655440000";
const USER_EMAIL = "john.doe@example.com";
const CURRENT_PASSWORD = "senhaAtual123";
const NEW_PASSWORD = "novaSenha123";

const mockUser = {
  userId: USER_ID,
  name: "John Doe",
  email: USER_EMAIL,
  balance: 0,
  role: "admin",
};

const mockAuthResponse = {
  token: "mock-token",
  user: mockUser,
};

// ─── resetPasswordFn (lógica de negócio — injeção de dependências) ────────────

describe("resetPasswordFn", () => {
  let fetchMock = mock();
  let apiMock: ApiClient;
  let authService: AuthService;

  beforeEach(() => {
    fetchMock = mock();
    apiMock = api.extend({ fetch: fetchMock });
    authService = new AuthService(apiMock);
    localStorage.clear();
  });

  it("should call auth/login with the user email and current password", async () => {
    fetchMock
      .mockImplementationOnce(async () => jsonResponse(mockAuthResponse))
      .mockImplementationOnce(async () => new Response(null, { status: 200 }));

    await resetPasswordFn(
      {
        userId: USER_ID,
        userEmail: USER_EMAIL,
        currentPassword: CURRENT_PASSWORD,
        password: NEW_PASSWORD,
      },
      { authService, apiClient: apiMock },
    );

    expect(fetchMock).toHaveBeenCalledTimes(2);

    const loginRequest = fetchMock.mock.calls[0]?.[0] as Request;
    expect(loginRequest).toBeInstanceOf(Request);
    expect(loginRequest.url).toContain("/auth/login");
    expect(loginRequest.method).toBe("POST");

    const body = await loginRequest.clone().json();
    expect(body).toEqual({ email: USER_EMAIL, password: CURRENT_PASSWORD });
  });

  it("should call PATCH users/{userId} with the new password after login succeeds", async () => {
    fetchMock
      .mockImplementationOnce(async () => jsonResponse(mockAuthResponse))
      .mockImplementationOnce(async () => new Response(null, { status: 200 }));

    await resetPasswordFn(
      {
        userId: USER_ID,
        userEmail: USER_EMAIL,
        currentPassword: CURRENT_PASSWORD,
        password: NEW_PASSWORD,
      },
      { authService, apiClient: apiMock },
    );

    const patchRequest = fetchMock.mock.calls[1]?.[0] as Request;
    expect(patchRequest).toBeInstanceOf(Request);
    expect(patchRequest.url).toContain(`/users/${USER_ID}`);
    expect(patchRequest.method).toBe("PATCH");

    const body = await patchRequest.clone().json();
    expect(body).toEqual({ password: NEW_PASSWORD });
  });

  it("should throw InvalidCurrentPasswordException when login fails", async () => {
    fetchMock.mockImplementationOnce(
      async () => new Response(null, { status: 401 }),
    );

    await expect(
      resetPasswordFn(
        {
          userId: USER_ID,
          userEmail: USER_EMAIL,
          currentPassword: "senhaErrada",
          password: NEW_PASSWORD,
        },
        { authService, apiClient: apiMock },
      ),
    ).rejects.toBeInstanceOf(InvalidCurrentPasswordException);
  });

  it("should not call PATCH when login fails", async () => {
    fetchMock.mockImplementationOnce(
      async () => new Response(null, { status: 401 }),
    );

    try {
      await resetPasswordFn(
        {
          userId: USER_ID,
          userEmail: USER_EMAIL,
          currentPassword: "senhaErrada",
          password: NEW_PASSWORD,
        },
        { authService, apiClient: apiMock },
      );
    } catch {
      // expected
    }

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("InvalidCurrentPasswordException should have the correct message", () => {
    const error = new InvalidCurrentPasswordException();
    expect(error.message).toBe("Senha atual incorreta.");
    expect(error).toBeInstanceOf(Error);
  });
});

// ─── useResetPassword (hook) — spyOn para não contaminar outros testes ────────

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useResetPassword", () => {
  let resetPasswordFnSpy = spyOn(resetPasswordModule, "resetPasswordFn");

  beforeEach(() => {
    resetPasswordFnSpy = spyOn(resetPasswordModule, "resetPasswordFn");
  });

  afterEach(() => {
    resetPasswordFnSpy.mockRestore();
  });

  it("should return a mutate function and start as idle", () => {
    const { result } = renderHook(() => useResetPassword(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.mutate).toBe("function");
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it("should call resetPasswordFn with the correct variables on mutate", async () => {
    resetPasswordFnSpy.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useResetPassword(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      userId: USER_ID,
      userEmail: USER_EMAIL,
      currentPassword: CURRENT_PASSWORD,
      password: NEW_PASSWORD,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(resetPasswordFnSpy).toHaveBeenCalledTimes(1);
    expect(resetPasswordFnSpy).toHaveBeenCalledWith({
      userId: USER_ID,
      userEmail: USER_EMAIL,
      currentPassword: CURRENT_PASSWORD,
      password: NEW_PASSWORD,
    });
  });

  it("should expose isError and the error when resetPasswordFn rejects", async () => {
    resetPasswordFnSpy.mockRejectedValueOnce(
      new InvalidCurrentPasswordException(),
    );

    const { result } = renderHook(() => useResetPassword(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      userId: USER_ID,
      userEmail: USER_EMAIL,
      currentPassword: "senhaErrada",
      password: NEW_PASSWORD,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(
      InvalidCurrentPasswordException,
    );
  });
});
