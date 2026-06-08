import { type ApiClient, api } from "@/lib/api";
import {
  type OccupancyDto,
  type UpdateOccupancyLimitDto,
  occupancySchema,
} from "./dtos/occupancyDto";

export class DashboardService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getOccupancy(): Promise<OccupancyDto> {
    return this.apiClient.get("dashboard/occupancy").json(occupancySchema);
  }

  async updateOccupancyLimit(dto: UpdateOccupancyLimitDto): Promise<void> {
    await this.apiClient.put("system/occupancy-limit", { json: dto }).json();
  }
}

export const dashboardService = new DashboardService(api);
