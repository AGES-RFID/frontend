import { describe, expect, it, mock } from "bun:test";
import { AntennaService } from "./AntennaService";

describe("AntennaService", () => {
  it("should call PUT /api/system/antennas/{id} with correct payload", async () => {
    const putMock = mock(() => ({ json: () => Promise.resolve({ id: "1" }) }));
    const apiClientMock = { put: putMock };

    // @ts-expect-error mock
    const service = new AntennaService(apiClientMock);
    await service.updateAntenna("antenna-id", {
      status: "On",
      sensibility: -50,
      power: 28.0,
    });

    expect(putMock).toHaveBeenCalledWith("system/antennas/antenna-id", {
      json: {
        status: "On",
        sensibility: -50,
        power: 28.0,
      },
    });
  });
});
