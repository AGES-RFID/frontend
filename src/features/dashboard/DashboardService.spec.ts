import { beforeEach, describe, expect, it, mock } from "bun:test";
import { type ApiClient, api } from "@/lib/api";
import { jsonResponse } from "/test/utils/makeResponse";
import { DashboardService } from "./DashboardService";

describe("DashboardService", () => {
  let fetchMock = mock();
  let apiMock: ApiClient;
  let service: DashboardService;

  beforeEach(() => {
    fetchMock = mock();
    apiMock = api.extend({ fetch: fetchMock });
    service = new DashboardService(apiMock);
  });

  describe("getVehicleFlow", () => {
    it("should call GET /dashboard/flow", async () => {
      fetchMock.mockImplementationOnce(async () => jsonResponse([]));

      await service.getVehicleFlow();

      const [request] = fetchMock.mock.calls[0] ?? [];
      expect(request.url).toContain("dashboard/flow");
      expect(request.method).toBe("GET");
    });

    it("should map response to GraphData format", async () => {
      const apiResponse = [
        { hour: 10, entries: 5, exits: 3 },
        { hour: 11, entries: 12, exits: 8 },
      ];

      fetchMock.mockImplementationOnce(async () => jsonResponse(apiResponse));

      const result = await service.getVehicleFlow();

      expect(result).toEqual([
        { hour: "10", entry: 5, exit: 3 },
        { hour: "11", entry: 12, exit: 8 },
      ]);
    });

    it("should convert hour number to string", async () => {
      fetchMock.mockImplementationOnce(async () =>
        jsonResponse([{ hour: 9, entries: 1, exits: 0 }]),
      );

      const result = await service.getVehicleFlow();

      expect(result[0]?.hour).toBe("9");
    });

    it("should return empty array when response is empty", async () => {
      fetchMock.mockImplementationOnce(async () => jsonResponse([]));

      const result = await service.getVehicleFlow();

      expect(result).toEqual([]);
    });
  });
});
