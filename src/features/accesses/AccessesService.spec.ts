import { beforeEach, describe, expect, it, mock } from "bun:test";
import { type ApiClient, api } from "@/lib/api";
import { jsonResponse } from "/test/utils/makeResponse";
import { AccessesService } from "./AccessesService";

describe("AccessesService", () => {
  let fetchMock = mock();
  let apiMock: ApiClient;
  let service: AccessesService;

  beforeEach(() => {
    fetchMock = mock();
    apiMock = api.extend({ fetch: fetchMock });
    service = new AccessesService(apiMock);
  });

  it("should call /accesses with accessType=exit when fetching recent exits", async () => {
    fetchMock.mockImplementationOnce(async () => jsonResponse([]));

    await service.getRecentExits();

    const [request] = fetchMock.mock.calls[0] ?? [];
    expect(request.url).toContain("/accesses");
    expect(request.url).toContain("accessType=exit");
    expect(request.method).toBe("GET");
  });

  it("should call /accesses/timeseries and return parsed response", async () => {
    const mockResponse = {
      from: "2026-06-13T10:00:00Z",
      to: "2026-06-14T10:00:00Z",
      series: [
        {
          key: "entries",
          points: [
            { timestamp: "2026-06-13T10:00:00Z", count: 20 },
            { timestamp: "2026-06-13T11:00:00Z", count: 35 },
          ],
        },
        {
          key: "exits",
          points: [
            { timestamp: "2026-06-13T10:00:00Z", count: 15 },
            { timestamp: "2026-06-13T11:00:00Z", count: 28 },
          ],
        },
      ],
    };

    fetchMock.mockImplementationOnce(async () => jsonResponse(mockResponse));

    const result = await service.getTimeseries();

    const [request] = fetchMock.mock.calls[0] ?? [];
    expect(request.url).toContain("/accesses/timeseries");
    expect(request.method).toBe("GET");

    expect(result.from).toBe("2026-06-13T10:00:00Z");
    expect(result.to).toBe("2026-06-14T10:00:00Z");
    expect(result.series).toHaveLength(2);

    const entries = result.series.find((s) => s.key === "entries");
    expect(entries).toBeDefined();
    expect(entries?.points).toHaveLength(2);
    expect(entries?.points.at(0)?.timestamp).toBe("2026-06-13T10:00:00Z");
    expect(entries?.points.at(0)?.count).toBe(20);

    const exits = result.series.find((s) => s.key === "exits");
    expect(exits).toBeDefined();
    expect(exits?.points).toHaveLength(2);
    expect(exits?.points.at(0)?.timestamp).toBe("2026-06-13T10:00:00Z");
    expect(exits?.points.at(0)?.count).toBe(15);
  });
});
