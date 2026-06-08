/** biome-ignore-all lint/style/noNonNullAssertion: Needed for array destructuring */
import { beforeEach, describe, expect, it, mock } from "bun:test";
import { type ApiClient, api, TOKEN_KEY } from "@/lib/api";
import { jsonResponse } from "/test/utils/makeResponse";
import type { UserDto } from "../users/dtos";
import { AuthService } from "./AuthService";
import type { LoginDto } from "./dtos";

const mockUser: UserDto = {
  userId: "550e8400-e29b-41d4-a716-446655440000",
  name: "John Doe",
  email: "john.doe@example.com",
  balance: 0,
  role: "admin",
};

const mockAuthResponse = {
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocktoken",
  user: mockUser,
};

const mockVehicle = {
  vehicleId: "0c58e273-7cbe-4e0a-b6c0-cde9e1b5e5b1",
  userId: mockUser.userId,
  plate: "ABC-1234",
  brand: "Tesla",
  model: "Model 3",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-02T00:00:00.000Z",
};

const mockUserWithVehicles = {
  ...mockUser,
  vehicles: [mockVehicle],
};

const loginDto: LoginDto = {
  email: "john.doe@example.com",
  password: "password123",
};

describe("AuthService", () => {
  describe("login", () => {
    let fetchMock = mock();
    let apiMock: ApiClient;
    let authService: AuthService;

    beforeEach(() => {
      fetchMock = mock();
      apiMock = api.extend({ fetch: fetchMock });
      authService = new AuthService(apiMock);
    });

    it("should call the api route with correct method and payload", async () => {
      fetchMock.mockImplementationOnce(async () =>
        jsonResponse(mockAuthResponse),
      );

      await authService.login(loginDto);

      expect(fetchMock).toHaveBeenCalledTimes(1);

      const [request] = fetchMock.mock.calls[0] ?? [];
      if (!request) {
        throw new Error("Expected a request to be sent");
      }
      expect(request).toBeInstanceOf(Request);
      expect(request.url).toContain("/auth/login");
      expect(request.method).toBe("POST");
      expect(request.headers.get("Content-Type")).toBe("application/json");
    });

    it("should send the correct email and password in the body", async () => {
      fetchMock.mockImplementationOnce(async () =>
        jsonResponse(mockAuthResponse),
      );

      await authService.login(loginDto);

      const [request] = fetchMock.mock.calls[0] ?? [];
      if (!request) {
        throw new Error("Expected a request to be sent");
      }
      const body = await request.clone().json();
      expect(body).toEqual(loginDto);
    });

    it("should return the token and user on success", async () => {
      fetchMock.mockImplementationOnce(async () =>
        jsonResponse(mockAuthResponse),
      );

      const result = await authService.login(loginDto);

      expect(result.token).toBe(mockAuthResponse.token);
      expect(result.user).toEqual(mockUser);
    });

    it("should store the token in localStorage", async () => {
      fetchMock.mockImplementationOnce(async () =>
        jsonResponse(mockAuthResponse),
      );

      await authService.login(loginDto);

      expect(localStorage.getItem(TOKEN_KEY)).toBe(mockAuthResponse.token);
    });

    it("should throw when the response is missing the token", async () => {
      fetchMock.mockImplementationOnce(async () =>
        jsonResponse({ user: mockUser }),
      );

      expect(authService.login(loginDto)).rejects.toBeDefined();
    });

    it("should throw when the response is missing the user", async () => {
      fetchMock.mockImplementationOnce(async () =>
        jsonResponse({ token: "some-token" }),
      );

      expect(authService.login(loginDto)).rejects.toBeDefined();
    });

    it("should throw when the response body is invalid", async () => {
      fetchMock.mockImplementationOnce(async () =>
        jsonResponse({ invalidField: true }),
      );

      expect(authService.login(loginDto)).rejects.toBeDefined();
    });
  });

  describe("logout", () => {
    let authService: AuthService;

    beforeEach(() => {
      authService = new AuthService(api);
      localStorage.clear();
    });

    it("should remove the token from localStorage", () => {
      localStorage.setItem(TOKEN_KEY, mockAuthResponse.token);

      authService.logout();

      expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    });
  });

  describe("me", () => {
    let fetchMock = mock();
    let apiMock: ApiClient;
    let authService: AuthService;

    beforeEach(() => {
      fetchMock = mock();
      apiMock = api.extend({ fetch: fetchMock });
      authService = new AuthService(apiMock);
      localStorage.clear();
    });

    it("should call the api with the bearer token", async () => {
      localStorage.setItem(TOKEN_KEY, mockAuthResponse.token);
      fetchMock.mockImplementationOnce(async () =>
        jsonResponse(mockUserWithVehicles),
      );

      await authService.me();

      const [request] = fetchMock.mock.calls[0] ?? [];
      if (!request) {
        throw new Error("Expected a request to be sent");
      }
      expect(request).toBeInstanceOf(Request);
      expect(request.url).toContain("/auth/me");
      expect(request.method).toBe("GET");
      expect(request.headers.get("Authorization")).toBe(
        `Bearer ${mockAuthResponse.token}`,
      );
    });

    it("should return the user with vehicles", async () => {
      localStorage.setItem(TOKEN_KEY, mockAuthResponse.token);
      fetchMock.mockImplementationOnce(async () =>
        jsonResponse(mockUserWithVehicles),
      );

      const result = await authService.me();

      expect(result).toEqual(mockUserWithVehicles);
    });

    it("should return null when there is no token", async () => {
      expect(await authService.me()).toBeNull();
    });

    it("should throw when the response body is invalid", async () => {
      localStorage.setItem(TOKEN_KEY, mockAuthResponse.token);
      fetchMock.mockImplementationOnce(async () => jsonResponse(mockUser));

      await expect(authService.me()).rejects.toBeDefined();
    });
  });
});
