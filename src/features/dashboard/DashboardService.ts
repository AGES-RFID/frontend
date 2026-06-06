import { z } from "zod";
import type { GraphData } from "@/components/ui/graph/types";
import { type ApiClient, api } from "@/lib/api";

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

  async getVehicleFlow(): Promise<GraphData> {
    const flow = await this.apiClient
      .get("dashboard/flow")
      .json(vehicleFlowSchema);

    const today = new Date();

    const entriesSeries = {
      name: "Entradas",
      color: "var(--color-blue)",
      points: flow.map((item) => ({
        timestamp: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          item.hour,
        ).toISOString(),
        value: item.entries,
      })),
    };

    const exitsSeries = {
      name: "Saídas",
      color: "var(--color-dark-orange)",
      points: flow.map((item) => ({
        timestamp: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          item.hour,
        ).toISOString(),
        value: item.exits,
      })),
    };

    return [entriesSeries, exitsSeries];
  }
}

export const dashboardService = new DashboardService(api);
