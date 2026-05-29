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
    });
  });
});
