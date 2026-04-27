/** biome-ignore-all lint/style/noNonNullAssertion: Needed for array destructuring */
import { beforeEach, describe, expect, it, mock } from "bun:test";
import { type ApiClient, api } from "@/lib/api";
import { jsonResponse } from "/test/utils/makeResponse";
import { AuthService } from "./AuthService";
import type { LoginDto } from "./dtos";

const mockUser = {
  userId: "550e8400-e29b-41d4-a716-446655440000",
  name: "John Doe",
  email: "john.doe@example.com",
};

const mockAuthResponse = {
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocktoken",
  user: mockUser,
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
});
