/** biome-ignore-all lint/style/noNonNullAssertion: Needed for array destructuring */
import { beforeEach, describe, expect, it, mock } from "bun:test";
import { type ApiClient, api } from "@/lib/api";
import { jsonResponse } from "/test/utils/makeResponse";
import type { CreateUserDto } from "./dtos";
import { UserService } from "./UserService";

describe("UserService", () => {
  describe("listUsers", () => {
    let fetchMock = mock();
    let apiMock: ApiClient;
    let userService: UserService;

    beforeEach(() => {
      fetchMock = mock();
      apiMock = api.extend({ fetch: fetchMock });
      userService = new UserService(apiMock);
    });

    it("should call the api route with the correct args", async () => {
      fetchMock.mockImplementationOnce(async () => jsonResponse([]));
      await userService.listUsers();

      expect(fetchMock).toHaveBeenCalledTimes(1);

      const [request] = fetchMock.mock.calls[0] ?? [];
      if (!request) {
        throw new Error("Expected a request to be sent");
      }
      expect(request).toBeInstanceOf(Request);
      expect(request.url).toContain("/users");
      expect(request.method).toBe("GET");
    });

    it("should return the user list with correct data", async () => {
      const mockUsers = [
        {
          userId: "550e8400-e29b-41d4-a716-446655440000",
          name: "John Doe",
          email: "john.doe@example.com",
        },
        {
          userId: "550e8400-e29b-41d4-a716-446655440001",
          name: "Jane Smith",
          email: "jane.smith@example.com",
        },
      ];

      fetchMock.mockImplementationOnce(async () => jsonResponse(mockUsers));

      const result = await userService.listUsers();

      expect(result).toEqual(mockUsers);
      expect(result).toHaveLength(2);
      expect(result[0]?.name).toBe("John Doe");
      expect(result[1]?.userId).toBe("550e8400-e29b-41d4-a716-446655440001");
    });

    it("should throw error when json returns invalid data", async () => {
      fetchMock.mockImplementationOnce(async () =>
        jsonResponse({ invalidField: "this is not a valid user list" }),
      );

      expect(userService.listUsers()).rejects.toBeDefined();
    });

    it("should throw error when user data is missing required fields", async () => {
      fetchMock.mockImplementationOnce(async () =>
        jsonResponse([{ userId: "550e8400-e29b-41d4-a716-446655440000" }]),
      );

      expect(userService.listUsers()).rejects.toBeDefined();
    });
  });

  describe("createUser", () => {
    let fetchMock = mock();
    let apiMock: ApiClient;
    let userService: UserService;

    beforeEach(() => {
      fetchMock = mock();
      apiMock = api.extend({ fetch: fetchMock });
      userService = new UserService(apiMock);
    });

    it("should call the api route with correct payload and json once", async () => {
      const createUserDto = { name: "John Doe", email: "john.doe@example.com" };

      fetchMock.mockImplementationOnce(async () =>
        jsonResponse({
          userId: "550e8400-e29b-41d4-a716-446655440000",
          name: "John Doe",
          email: "john.doe@example.com",
        }),
      );

      await userService.createUser(createUserDto);

      const [request] = fetchMock.mock.calls[0] ?? [];
      if (!request) {
        throw new Error("Expected a request to be sent");
      }
      expect(request).toBeInstanceOf(Request);
      expect(request.url).toContain("/users");
      expect(request.method).toBe("POST");
      expect(request.headers.get("Content-Type")).toBe("application/json");
      const body = await request.clone().json();
      expect(body).toEqual(createUserDto);
    });

    it("should return the created user with correct data", async () => {
      const createUserDto = {
        name: "Jane Smith",
        email: "jane.smith@example.com",
      };
      const createdUser = {
        userId: "550e8400-e29b-41d4-a716-446655440001",
        name: "Jane Smith",
        email: "jane.smith@example.com",
      };

      fetchMock.mockImplementationOnce(async () => jsonResponse(createdUser));

      const result = await userService.createUser(createUserDto);

      expect(result).toEqual(createdUser);
    });

    it("should throw error when json returns invalid user data", async () => {
      const createUserDto = { name: "John Doe", email: "john.doe@example.com" };

      fetchMock.mockImplementationOnce(async () =>
        jsonResponse({
          invalidField: "this is not a valid user dto",
        }),
      );

      expect(userService.createUser(createUserDto)).rejects.toBeDefined();
    });

    it("should throw error when user data is missing required fields", async () => {
      const createUserDto = { name: "John Doe" } as CreateUserDto; // cast to make typescript happy;

      fetchMock.mockImplementationOnce(async () =>
        jsonResponse({
          name: "John Doe",
        }),
      );

      expect(userService.createUser(createUserDto)).rejects.toBeDefined();
    });
  });

  describe("getUserById", () => {
    let fetchMock = mock();
    let apiMock: ApiClient;
    let userService: UserService;

    beforeEach(() => {
      fetchMock = mock();
      apiMock = api.extend({ fetch: fetchMock });
      userService = new UserService(apiMock);
    });

    it("should call the api route with correct userId", async () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000";

      fetchMock.mockImplementationOnce(async () =>
        jsonResponse({
          userId,
          name: "John Doe",
          email: "john.doe@example.com",
        }),
      );

      await userService.getUserById(userId);

      expect(fetchMock).toHaveBeenCalledTimes(1);

      const [request] = fetchMock.mock.calls[0] ?? [];
      if (!request) {
        throw new Error("Expected a request to be sent");
      }
      expect(request).toBeInstanceOf(Request);
      expect(request.url).toContain(`/users/${userId}`);
      expect(request.method).toBe("GET");
    });

    it("should return the user with correct data", async () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000";
      const user = {
        userId,
        name: "John Doe",
        email: "john.doe@example.com",
      };

      fetchMock.mockImplementationOnce(async () => jsonResponse(user));

      const result = await userService.getUserById(userId);

      expect(result).toEqual(user);
      expect(result.userId).toBe(userId);
      expect(result.name).toBe("John Doe");
    });

    it("should throw error when user data is invalid", async () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000";

      fetchMock.mockImplementationOnce(async () =>
        jsonResponse({
          invalidField: "this is not a valid user",
        }),
      );

      expect(userService.getUserById(userId)).rejects.toBeDefined();
    });
  });

  describe("editUser", () => {
    let fetchMock = mock();
    let apiMock: ApiClient;
    let userService: UserService;

    beforeEach(() => {
      fetchMock = mock();
      apiMock = api.extend({ fetch: fetchMock });
      userService = new UserService(apiMock);
    });

    it("should call the api route with correct userId and update data", async () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000";
      const updateUserDto = { name: "Jane Smith" };

      fetchMock.mockImplementationOnce(async () => jsonResponse({}));

      await userService.editUser(userId, updateUserDto);

      expect(fetchMock).toHaveBeenCalledTimes(1);

      const [request] = fetchMock.mock.calls[0] ?? [];
      if (!request) {
        throw new Error("Expected a request to be sent");
      }
      expect(request).toBeInstanceOf(Request);
      expect(request.url).toContain(`/users/${userId}`);
      expect(request.method).toBe("PUT");
      expect(request.headers.get("Content-Type")).toBe("application/json");
      const body = await request.clone().json();
      expect(body).toEqual(updateUserDto);
    });

    it("should handle partial updates", async () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000";
      const updateUserDto = { email: "newemail@example.com" };

      fetchMock.mockImplementationOnce(async () => jsonResponse({}));

      await userService.editUser(userId, updateUserDto);

      expect(fetchMock).toHaveBeenCalledTimes(1);

      const [request] = fetchMock.mock.calls[0] ?? [];
      if (!request) {
        throw new Error("Expected a request to be sent");
      }
      expect(request).toBeInstanceOf(Request);
      expect(request.url).toContain(`/users/${userId}`);
      expect(request.method).toBe("PUT");
      expect(request.headers.get("Content-Type")).toBe("application/json");
      const body = await request.clone().json();
      expect(body).toEqual(updateUserDto);
    });
  });

  describe("deleteUser", () => {
    let fetchMock = mock();
    let apiMock: ApiClient;
    let userService: UserService;

    beforeEach(() => {
      fetchMock = mock();
      apiMock = api.extend({ fetch: fetchMock });
      userService = new UserService(apiMock);
    });

    it("should call the api route with correct userId", async () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000";

      fetchMock.mockImplementationOnce(
        async () => new Response(null, { status: 204 }),
      );

      await userService.deleteUser(userId);

      expect(fetchMock).toHaveBeenCalledTimes(1);

      const [request] = fetchMock.mock.calls[0] ?? [];
      if (!request) {
        throw new Error("Expected a request to be sent");
      }
      expect(request).toBeInstanceOf(Request);
      expect(request.url).toContain(`/users/${userId}`);
      expect(request.method).toBe("DELETE");
    });
  });

  describe("addCredit", () => {
    let fetchMock = mock();
    let apiMock: ApiClient;
    let userService: UserService;

    beforeEach(() => {
      fetchMock = mock();
      apiMock = api.extend({ fetch: fetchMock });
      userService = new UserService(apiMock);
    });

    it("should call the api route with correct userId and amount", async () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000";
      const amount = 42.5;

      fetchMock.mockImplementationOnce(
        async () => new Response(null, { status: 204 }),
      );

      await userService.addCredit(userId, amount);

      expect(fetchMock).toHaveBeenCalledTimes(1);

      const [request] = fetchMock.mock.calls[0] ?? [];
      if (!request) {
        throw new Error("Expected a request to be sent");
      }
      expect(request).toBeInstanceOf(Request);
      expect(request.url).toContain(`/users/${userId}/balance`);
      expect(request.method).toBe("PATCH");
      expect(request.headers.get("Content-Type")).toBe("application/json");
      const body = await request.clone().json();
      expect(body).toEqual({ amount });
    });

    it("should send zero as amount when value is 0", async () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000";

      fetchMock.mockImplementationOnce(
        async () => new Response(null, { status: 204 }),
      );

      await userService.addCredit(userId, 0);

      const [request] = fetchMock.mock.calls[0] ?? [];
      if (!request) {
        throw new Error("Expected a request to be sent");
      }
      const body = await request.clone().json();
      expect(body).toEqual({ amount: 0 });
    });
  });
});
