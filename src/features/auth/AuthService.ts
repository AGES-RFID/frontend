import { type ApiClient, api } from "@/lib/api";
import {
  type UserWithVehiclesDto,
  userWithVehiclesSchema,
} from "../users/dtos";
import {
  type AuthResponseDto,
  authResponseSchema,
  type LoginDto,
} from "./dtos";

export class AuthService {
  private readonly apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const response = await this.apiClient
      .post("auth/login", { json: loginDto })
      .json(authResponseSchema);

    localStorage.setItem("rfid-auth-token", response.token);

    return response;
  }

  async me(): Promise<UserWithVehiclesDto> {
    const token = localStorage.getItem("rfid-auth-token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await this.apiClient
      .get("auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .json(userWithVehiclesSchema);

    return response;
  }
}

export const authService = new AuthService(api);
