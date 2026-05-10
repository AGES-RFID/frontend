import { isHTTPError } from "ky";
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

export const TOKEN_KEY = "rfid-auth-token";

export class AuthService {
  private readonly apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const response = await this.apiClient
      .post("auth/login", { json: loginDto })
      .json(authResponseSchema);

    localStorage.setItem(TOKEN_KEY, response.token);

    return response;
  }

  async me(): Promise<UserWithVehiclesDto | null> {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      return null;
    }

    try {
      const response = await this.apiClient
        .get("auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .json(userWithVehiclesSchema);

      return response;
    } catch (e) {
      if (isHTTPError(e) && e.response.status === 401) {
        return null;
      }

      throw e;
    }
  }
}

export const authService = new AuthService(api);
