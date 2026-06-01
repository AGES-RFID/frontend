import { z } from "zod";
import { type ApiClient, api } from "@/lib/api";
import type { GraphData } from "@/components/ui/graph/types";

const vehicleFlowItemSchema = z.object({
  hour: z.number(),
  entries: z.number(),
  exits: z.number(),
});

const vehicleFlowSchema = z.array(vehicleFlowItemSchema);

export class DashboardService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getVehicleFlow(): Promise<GraphData[]> {
    const flow = await this.apiClient
      .get("dashboard/flow")
      .json(vehicleFlowSchema);

    return flow.map((item) => ({
      hour: item.hour.toString(),
      entry: item.entries,
      exit: item.exits,
    }));
  }
}

export const dashboardService = new DashboardService(api);
