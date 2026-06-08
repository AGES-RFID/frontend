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

  it("should call GET /api/system/antennas and return a list of antennas", async () => {
    const mockList = [
      {
        id: "antenna-1",
        name: "Antena 1",
        status: "On" as const,
        sensibility: -50,
        power: 28.0,
      },
    ];
    const getMock = mock(() => ({ json: () => Promise.resolve(mockList) }));
    const apiClientMock = { get: getMock };

    // @ts-expect-error mock
    const service = new AntennaService(apiClientMock);
    const result = await service.getAntennas();

    expect(getMock).toHaveBeenCalledWith("system/antennas");
    expect(result).toEqual(mockList);
  });
});
