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
});
