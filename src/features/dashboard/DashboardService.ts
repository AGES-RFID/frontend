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

  async updateOccupancyLimit(dto: UpdateOccupancyLimitDto): Promise<void> {
    await this.apiClient.put("system/max-occupancy", { json: dto }).json();
  }
}

export const dashboardService = new DashboardService(api);
