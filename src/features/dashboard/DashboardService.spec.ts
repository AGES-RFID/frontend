import { describe, expect, it, mock } from "bun:test";
import { DashboardService } from "./DashboardService";

describe("DashboardService", () => {
  it("should call GET dashboard/occupancy and return parsed data", async () => {
    const mockResponse = {
      currentOccupancy: 5,
      maxOccupancy: 100,
      occupancyPercentage: 5.0,
      vehicles: [],
    };
    const apiClientMock = {
      get: mock(() => ({
        json: () => Promise.resolve(mockResponse),
      })),
    };
    // @ts-expect-error
    const service = new DashboardService(apiClientMock);

    const result = await service.getOccupancy();

    expect(apiClientMock.get).toHaveBeenCalledWith("dashboard/occupancy");
    expect(result.currentOccupancy).toBe(5);
    expect(result.maxOccupancy).toBe(100);
    expect(result.occupancyPercentage).toBe(5.0);
  });

  it("should call PUT system/occupancy-max with the correct body", async () => {
    const apiClientMock = {
      put: mock(() => ({ json: () => Promise.resolve() })),
    };
    // @ts-expect-error
    const service = new DashboardService(apiClientMock);

    await service.updateOccupancyLimit({ maxOccupancy: 150 });

    expect(apiClientMock.put).toHaveBeenCalledWith("system/occupancy-max", {
      json: { maxOccupancy: 150 },
    });
  });

  it("should propagate errors from getOccupancy", async () => {
    const apiClientMock = {
      get: mock(() => ({
        json: () => Promise.reject(new Error("Network error")),
      })),
    };
    // @ts-expect-error
    const service = new DashboardService(apiClientMock);

    await expect(service.getOccupancy()).rejects.toThrow("Network error");
  });

  it("should propagate errors from updateOccupancyLimit", async () => {
    const apiClientMock = {
      put: mock(() => ({
        json: () => Promise.reject(new Error("Forbidden")),
      })),
    };
    // @ts-expect-error
    const service = new DashboardService(apiClientMock);

    await expect(
      service.updateOccupancyLimit({ maxOccupancy: 100 }),
    ).rejects.toThrow("Forbidden");
  });
});
