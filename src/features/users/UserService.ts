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
    // Já existe a feature de integração do zod com o ky:
    // https://github.com/sindresorhus/ky/pull/830
    // A PR foi aprovada, mas não foi publicada uma versão nova.
    // Na próxima versão, poderemos reescrever esse código como:
    // const users =  await api.get("/users").json({ schema: userListSchema }),
    const users = userListSchema.parse(
      await this.apiClient.get("users").json(),
    );
    return users;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    const user = userSchema.parse(
      await this.apiClient.post("users", { json: createUserDto }).json(),
    );

    return user;
  }
}

export const userService = new UserService(api);
