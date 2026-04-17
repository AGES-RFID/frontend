import { type ApiClient, api } from "@/lib/api";
import {
  type CreateVehicleDto,
  type VehicleDto,
  type VehicleListDto,
  type VehicleWithOwnerDto,
  type VehicleWithOwnerListDto,
  createVehicleSchema,
  vehicleListSchema,
  vehicleSchema,
  vehicleWithOwnerSchema,
  vehicleWithOwnerListSchema,
} from "./dtos";

interface ListVehiclesOptions {
  includeOwner?: boolean;
}

export class VehicleService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async listVehicles(options?: {
    includeOwner: true;
  }): Promise<VehicleWithOwnerListDto>;
  async listVehicles(
    options?: { includeOwner: false } | ListVehiclesOptions,
  ): Promise<VehicleListDto>;
  async listVehicles(
    options?: ListVehiclesOptions,
  ): Promise<VehicleWithOwnerListDto | VehicleListDto> {
    const params = new URLSearchParams();
    const includeOwner = options?.includeOwner ?? true;

    if (includeOwner) {
      params.append("include", "users");
    }

    const url = `vehicles${params.toString() ? "?" + params : ""}`;
    const schema = includeOwner
      ? vehicleWithOwnerListSchema
      : vehicleListSchema;

    const vehicles = await this.apiClient.get(url).json(schema);
    return vehicles;
  }

  async getVehicleById(vehicleId: string): Promise<VehicleDto> {
    const vehicle = await this.apiClient
      .get(`vehicles/${vehicleId}`)
      .json(vehicleSchema);

    return vehicle;
  }

  async createVehicle(createVehicleDto: CreateVehicleDto): Promise<VehicleDto> {
    const normalized = {
      userId: createVehicleDto.userId,
      plate: this.normalizePlate(createVehicleDto.plate),
      brand: createVehicleDto.brand.trim(),
      model: createVehicleDto.model.trim(),
    };

    const vehicle = await this.apiClient
      .post("vehicles", { json: normalized })
      .json(vehicleSchema);

    return vehicle;
  }

  async editVehicle(
    vehicleId: string,
    updateVehicleDto: Partial<CreateVehicleDto>,
  ): Promise<void> {
    const normalized: Record<string, string> = {};

    if (updateVehicleDto.userId) {
      normalized.userId = updateVehicleDto.userId;
    }
    if (updateVehicleDto.plate) {
      normalized.plate = this.normalizePlate(updateVehicleDto.plate);
    }
    if (updateVehicleDto.brand) {
      normalized.brand = updateVehicleDto.brand.trim();
    }
    if (updateVehicleDto.model) {
      normalized.model = updateVehicleDto.model.trim();
    }

    await this.apiClient
      .put(`vehicles/${vehicleId}`, { json: normalized })
      .json();
  }

  async deleteVehicle(vehicleId: string): Promise<void> {
    await this.apiClient.delete(`vehicles/${vehicleId}`);
  }

  private normalizePlate(plate: string): string {
    return plate
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 7);
  }
}

export const vehicleService = new VehicleService(api);
