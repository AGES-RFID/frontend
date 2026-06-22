import { type ApiClient, api } from "@/lib/api";
import {
  type DashboardMetricsDto,
  dashboardMetricsSchema,
} from "./dtos/dashboardMetricsDto";
import {
  type OccupancyDto,
  type UpdateOccupancyLimitDto,
  occupancySchema,
} from "./dtos/occupancyDto";
import {
  type PermanenceDto,
  permanenceSchema,
} from "@/features/vehicles/dtos/permanenceDto";

export class DashboardService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getMetrics(): Promise<DashboardMetricsDto> {
    return this.apiClient.get("dashboard/metrics").json(dashboardMetricsSchema);
  }

  async getDashboard(): Promise<DashboardMetricsDto> {
    return this.apiClient.get("dashboard").json(dashboardMetricsSchema);
  }

  async getOccupancy(): Promise<OccupancyDto> {
    return this.apiClient.get("dashboard/occupancy").json(occupancySchema);
  }

  async getPermanence(): Promise<PermanenceDto[]> {
    return this.apiClient
      .get("dashboard/permanence")
      .json(permanenceSchema.array());
  }
  async updateOccupancyLimit(dto: UpdateOccupancyLimitDto): Promise<void> {
    await this.apiClient.put("system/max-occupancy", { json: dto }).json();
  }
}

export const dashboardService = new DashboardService(api);
