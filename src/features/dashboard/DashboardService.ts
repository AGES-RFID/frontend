import { type ApiClient, api } from "@/lib/api";
import {
  type DashboardMetricsDto,
  dashboardMetricsSchema,
} from "./dtos/dashboardMetricsDto";

export class DashboardService {
  private apiClient: Pick<ApiClient, "get">;

  constructor(apiClient: Pick<ApiClient, "get">) {
    this.apiClient = apiClient;
  }

  async getMetrics(): Promise<DashboardMetricsDto> {
    return this.apiClient.get("dashboard/metrics").json(dashboardMetricsSchema);
  }
}

export const dashboardService = new DashboardService(api);
