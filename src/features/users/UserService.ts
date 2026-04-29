import { type ApiClient, api } from "@/lib/api";
import {
  type CreateUserDto,
  type UserDto,
  type UserListDto,
  userListSchema,
  userSchema,
} from "./dtos";

export class UserService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async listUsers(): Promise<UserListDto> {
    const users = await this.apiClient.get("users").json(userListSchema);

    return users;
  }

  async getUserById(userId: string): Promise<UserDto> {
    const user = await this.apiClient.get(`users/${userId}`).json(userSchema);

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.apiClient
      .post("users", { json: createUserDto })
      .json(userSchema);

    return user;
  }

  async editUser(
    userId: string,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<void> {
    await this.apiClient.put(`users/${userId}`, { json: updateUserDto }).json();
  }

  async deleteUser(userId: string): Promise<void> {
    await this.apiClient.delete(`users/${userId}`);
  }

  async addCredit(userId: string, amount: number): Promise<void> {
    await this.apiClient.patch(`users/${userId}/balance`, {
      json: { amount },
    });
  }
}

export const userService = new UserService(api);
