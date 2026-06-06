import { beforeEach, describe, mock } from "bun:test";
import { type ApiClient, api } from "@/lib/api";
import { DashboardService } from "./DashboardService";

describe("DashboardService", () => {
  let fetchMock = mock();
  let apiMock: ApiClient;
  let _service: DashboardService;

  beforeEach(() => {
    fetchMock = mock();
    apiMock = api.extend({ fetch: fetchMock });
    _service = new DashboardService(apiMock);
  });
});
