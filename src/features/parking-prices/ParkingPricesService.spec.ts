import { describe, expect, it, mock } from "bun:test";
import { ParkingPricesService } from "./ParkingPricesService";

describe("ParkingPricesService", () => {
  it("should get the most recent pricing from list", async () => {
    const apiClientMock = {
      get: mock(() => ({
        json: () =>
          Promise.resolve([
            {
              parkingPriceId: "550e8400-e29b-41d4-a716-446655440000",
              toleranceMinutes: 15,
              basePrice: 15,
              thresholdMinutes: 180,
              hourlyRate: 5,
              createdAt: "2026-01-01T10:00:00.000Z",
              updatedAt: "2026-01-01T10:00:00.000Z",
            },
            {
              parkingPriceId: "550e8400-e29b-41d4-a716-446655440001",
              toleranceMinutes: 20,
              basePrice: 18,
              thresholdMinutes: 240,
              hourlyRate: 7,
              createdAt: "2026-01-02T10:00:00.000Z",
              updatedAt: "2026-01-03T10:00:00.000Z",
            },
          ]),
      })),
    };

    // @ts-expect-error mock
    const service = new ParkingPricesService(apiClientMock);
    const result = await service.getPricing();

    expect(result.parkingPriceId).toBe("550e8400-e29b-41d4-a716-446655440001");
  });

  it("should update pricing by id", async () => {
    const patchMock = mock(() => ({ json: () => Promise.resolve() }));
    const apiClientMock = { patch: patchMock };

    // @ts-expect-error mock
    const service = new ParkingPricesService(apiClientMock);
    await service.updatePricing("pricing-id", {
      toleranceMinutes: 15,
      basePrice: 15,
      hourlyRate: 5,
    });

    expect(patchMock).toHaveBeenCalledWith("parking-prices/pricing-id", {
      json: {
        toleranceMinutes: 15,
        basePrice: 15,
        hourlyRate: 5,
      },
    });
  });
});
