import type { Mock } from "bun:test";
import { beforeEach, describe, expect, it, mock } from "bun:test";
import type { ApiClient } from "@/lib/api";
import type { CreateUserDto } from "./dtos";
import { UserService } from "./UserService";

describe("UserService", () => {
  describe("listUsers", () => {
    let jsonMock: Mock<() => Promise<unknown>>;
    let getMock: Mock<(path: string) => { json: typeof jsonMock }>;
    let apiMock: ApiClient;
    let userService: UserService;

    beforeEach(() => {
      jsonMock = mock(async () => []);
      getMock = mock(() => ({ json: jsonMock }));

      apiMock = { get: getMock } as unknown as ApiClient;
      userService = new UserService(apiMock);
    });

    it("should call the api route and json once", async () => {
      await userService.listUsers();

      expect(getMock).toHaveBeenCalledTimes(1);
      expect(getMock).toHaveBeenCalledWith("users");
      expect(jsonMock).toHaveBeenCalledTimes(1);
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

      jsonMock.mockImplementationOnce(async () => mockUsers);

      const result = await userService.listUsers();

      expect(result).toEqual(mockUsers);
      expect(result).toHaveLength(2);
      expect(result[0]?.name).toBe("John Doe");
      expect(result[1]?.userId).toBe("550e8400-e29b-41d4-a716-446655440001");
    });

    it("should throw error when json returns invalid data", async () => {
      jsonMock.mockImplementationOnce(async () => ({
        invalidField: "this is not a valid user list",
      }));

      expect(userService.listUsers()).rejects.toBeDefined();
    });

    it("should throw error when user data is missing required fields", async () => {
      jsonMock.mockImplementationOnce(async () => [
        { userId: "550e8400-e29b-41d4-a716-446655440000" },
      ]);

      expect(userService.listUsers()).rejects.toBeDefined();
    });
  });

  describe("createUser", () => {
    let jsonMock: Mock<() => Promise<unknown>>;
    let postMock: Mock<
      (path: string, options: { json: unknown }) => { json: typeof jsonMock }
    >;
    let apiMock: ApiClient;
    let userService: UserService;

    beforeEach(() => {
      jsonMock = mock(async () => ({}));
      postMock = mock(() => ({ json: jsonMock }));

      apiMock = { post: postMock } as unknown as ApiClient;
      userService = new UserService(apiMock);
    });

    it("should call the api route with correct payload and json once", async () => {
      const createUserDto = { name: "John Doe", email: "john.doe@example.com" };

      jsonMock.mockImplementationOnce(async () => ({
        userId: "550e8400-e29b-41d4-a716-446655440000",
        name: "John Doe",
        email: "john.doe@example.com",
      }));

      await userService.createUser(createUserDto);

      expect(postMock).toHaveBeenCalledTimes(1);
      expect(postMock).toHaveBeenCalledWith("users", { json: createUserDto });
      expect(jsonMock).toHaveBeenCalledTimes(1);
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

      jsonMock.mockImplementationOnce(async () => createdUser);

      const result = await userService.createUser(createUserDto);

      expect(result).toEqual(createdUser);
      expect(result.userId).toBe("550e8400-e29b-41d4-a716-446655440001");
      expect(result.name).toBe("Jane Smith");
    });

    it("should throw error when json returns invalid user data", async () => {
      const createUserDto = { name: "John Doe", email: "john.doe@example.com" };

      jsonMock.mockImplementationOnce(async () => ({
        invalidField: "this is not a valid user dto",
      }));

      expect(userService.createUser(createUserDto)).rejects.toBeDefined();
    });

    it("should throw error when user data is missing required fields", async () => {
      const createUserDto = { name: "John Doe" } as CreateUserDto; // cast to make typescript happy;

      jsonMock.mockImplementationOnce(async () => ({
        name: "John Doe",
      }));

      expect(userService.createUser(createUserDto)).rejects.toBeDefined();
    });
  });

  describe("getUserById", () => {
    let jsonMock: Mock<() => Promise<unknown>>;
    let getMock: Mock<(path: string) => { json: typeof jsonMock }>;
    let apiMock: ApiClient;
    let userService: UserService;

    beforeEach(() => {
      jsonMock = mock(async () => ({}));
      getMock = mock(() => ({ json: jsonMock }));

      apiMock = { get: getMock } as unknown as ApiClient;
      userService = new UserService(apiMock);
    });

    it("should call the api route with correct userId", async () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000";

      jsonMock.mockImplementationOnce(async () => ({
        userId,
        name: "John Doe",
        email: "john.doe@example.com",
      }));

      await userService.getUserById(userId);

      expect(getMock).toHaveBeenCalledTimes(1);
      expect(getMock).toHaveBeenCalledWith(`users/${userId}`);
      expect(jsonMock).toHaveBeenCalledTimes(1);
    });

    it("should return the user with correct data", async () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000";
      const user = {
        userId,
        name: "John Doe",
        email: "john.doe@example.com",
      };

      jsonMock.mockImplementationOnce(async () => user);

      const result = await userService.getUserById(userId);

      expect(result).toEqual(user);
      expect(result.userId).toBe(userId);
      expect(result.name).toBe("John Doe");
    });

    it("should throw error when user data is invalid", async () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000";

      jsonMock.mockImplementationOnce(async () => ({
        invalidField: "this is not a valid user",
      }));

      expect(userService.getUserById(userId)).rejects.toBeDefined();
    });
  });

  describe("editUser", () => {
    let jsonMock: Mock<() => Promise<unknown>>;
    let putMock: Mock<
      (path: string, options: { json: unknown }) => { json: typeof jsonMock }
    >;
    let apiMock: ApiClient;
    let userService: UserService;

    beforeEach(() => {
      jsonMock = mock(async () => undefined);
      putMock = mock(() => ({ json: jsonMock }));

      apiMock = { put: putMock } as unknown as ApiClient;
      userService = new UserService(apiMock);
    });

    it("should call the api route with correct userId and update data", async () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000";
      const updateUserDto = { name: "Jane Smith" };

      await userService.editUser(userId, updateUserDto);

      expect(putMock).toHaveBeenCalledTimes(1);
      expect(putMock).toHaveBeenCalledWith(`users/${userId}`, {
        json: updateUserDto,
      });
      expect(jsonMock).toHaveBeenCalledTimes(1);
    });

    it("should handle partial updates", async () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000";
      const updateUserDto = { email: "newemail@example.com" };

      await userService.editUser(userId, updateUserDto);

      expect(putMock).toHaveBeenCalledTimes(1);
      expect(putMock).toHaveBeenCalledWith(`users/${userId}`, {
        json: updateUserDto,
      });
    });
  });

  describe("deleteUser", () => {
    let deleteMock: Mock<(path: string) => Promise<unknown>>;
    let apiMock: ApiClient;
    let userService: UserService;

    beforeEach(() => {
      deleteMock = mock(async () => undefined);

      apiMock = { delete: deleteMock } as unknown as ApiClient;
      userService = new UserService(apiMock);
    });

    it("should call the api route with correct userId", async () => {
      const userId = "550e8400-e29b-41d4-a716-446655440000";

      await userService.deleteUser(userId);

      expect(deleteMock).toHaveBeenCalledTimes(1);
      expect(deleteMock).toHaveBeenCalledWith(`users/${userId}`);
    });
  });
});
