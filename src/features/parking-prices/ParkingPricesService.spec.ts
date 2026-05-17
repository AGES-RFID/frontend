import { describe, expect, it, mock } from "bun:test";
import { ParkingPricesService } from "./ParkingPricesService";

describe("ParkingPricesService", () => {
  it("should get pricing", async () => {
    const apiClientMock = {
      get: mock(() => ({
        json: () =>
          Promise.resolve([
            { toleranceMinutes: 15, basePrice: 15, hourlyRate: 5 },
          ]),
      })),
    };
    // @ts-expect-error
    const service = new ParkingPricesService(apiClientMock);
    const result = await service.getPricing();
    expect(result.toleranceMinutes).toBe(15);
  });

  it("should update pricing", async () => {
    const apiClientMock = {
      put: mock(() => ({ json: () => Promise.resolve() })),
    };
    // @ts-expect-error
    const service = new ParkingPricesService(apiClientMock);
    await service.updatePricing({
      toleranceMinutes: 15,
      basePrice: 15,
      hourlyRate: 5,
    });
    expect(apiClientMock.put).toHaveBeenCalled();
  });
});
