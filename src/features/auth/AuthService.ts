import { type ApiClient, api } from "@/lib/api";
import {
  type AuthResponseDto,
  type LoginDto,
  authResponseSchema,
} from "./dtos";

export class AuthService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const response = await this.apiClient
      .post("auth/login", { json: loginDto })
      .json(authResponseSchema);

    return response;
  }
}

export const authService = new AuthService(api);
