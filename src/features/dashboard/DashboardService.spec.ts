import { describe, expect, it, mock } from "bun:test";
import { api } from "@/lib/api";
import { jsonResponse } from "/test/utils/makeResponse";
import { DashboardService } from "./DashboardService";

describe("DashboardService", () => {
  it("should get dashboard metrics", async () => {
    let observedRequest: Request | undefined;
    const fetchMock = mock((input: RequestInfo | URL, init?: RequestInit) => {
      observedRequest = new Request(input, init);
      return Promise.resolve(
        jsonResponse({
          entriesLastHour: 8,
          exitsLastHour: 3,
          peakEntryTime: "09:00",
          peakHourEntries: 8,
          currentOccupancy: 0,
          maxOccupancy: 100,
          accesses: [],
          updatedAt: "2026-06-20T20:00:00Z",
        }),
      );
    });
    const apiMock = api.extend({ fetch: fetchMock });

    const service = new DashboardService(apiMock);
    const result = await service.getMetrics();

    if (!observedRequest) throw new Error("Request was not called");
    expect(observedRequest.url).toContain("/dashboard/metrics");
    expect(observedRequest.method).toBe("GET");
    expect(result).toEqual({
      entriesLastHour: 8,
      exitsLastHour: 3,
      peakEntryTime: "09:00",
      peakHourEntries: 8,
      currentOccupancy: 0,
      maxOccupancy: 100,
      accesses: [],
      updatedAt: "2026-06-20T20:00:00Z",
    });
  });

  it("should call GET dashboard and return consolidated data", async () => {
    let observedRequest: Request | undefined;
    const fetchMock = mock((input: RequestInfo | URL, init?: RequestInit) => {
      observedRequest = new Request(input, init);
      return Promise.resolve(
        jsonResponse({
          entriesLastHour: 5,
          exitsLastHour: 2,
          peakEntryTime: "14:00",
          peakHourEntries: 12,
          currentOccupancy: 3,
          maxOccupancy: 100,
          accesses: [],
          updatedAt: "2026-06-20T20:00:00Z",
        }),
      );
    });
    const apiMock = api.extend({ fetch: fetchMock });

    const service = new DashboardService(apiMock);
    const result = await service.getDashboard();

    if (!observedRequest) throw new Error("Request was not called");
    expect(observedRequest.url).toContain("/dashboard");
    expect(observedRequest.method).toBe("GET");
    expect(result).toEqual({
      entriesLastHour: 5,
      exitsLastHour: 2,
      peakEntryTime: "14:00",
      peakHourEntries: 12,
      currentOccupancy: 3,
      maxOccupancy: 100,
      accesses: [],
      updatedAt: "2026-06-20T20:00:00Z",
    });
  });

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

  it("should call PUT system/max-occupancy with the correct body", async () => {
    const apiClientMock = {
      put: mock(() => ({ json: () => Promise.resolve() })),
    };
    // @ts-expect-error
    const service = new DashboardService(apiClientMock);

    await service.updateOccupancyLimit({ maxOccupancy: 150 });

    expect(apiClientMock.put).toHaveBeenCalledWith("system/max-occupancy", {
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
