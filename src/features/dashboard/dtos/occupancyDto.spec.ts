import { describe, expect, it } from "bun:test";
import { occupancySchema, updateOccupancyLimitSchema } from "./occupancyDto";

describe("occupancySchema", () => {
  it("should parse a valid occupancy response", () => {
    const input = {
      currentOccupancy: 5,
      maxOccupancy: 100,
      occupancyPercentage: 5.0,
      vehicles: [],
    };
    const result = occupancySchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("should parse occupancy with vehicles", () => {
    const input = {
      currentOccupancy: 1,
      maxOccupancy: 50,
      occupancyPercentage: 2.0,
      vehicles: [
        {
          vehicleId: "550e8400-e29b-41d4-a716-446655440000",
          userId: "550e8400-e29b-41d4-a716-446655440001",
          plate: "ABC-1234",
          brand: "Honda",
          model: "Civic",
          createdAt: "2026-01-01T00:00:00Z",
          updatedAt: "2026-01-01T00:00:00Z",
        },
      ],
    };
    const result = occupancySchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.vehicles).toHaveLength(1);
    }
  });

  it("should fail when maxOccupancy is missing", () => {
    const input = {
      currentOccupancy: 5,
      occupancyPercentage: 5.0,
      vehicles: [],
    };
    const result = occupancySchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should fail when vehicles is missing", () => {
    const input = {
      currentOccupancy: 5,
      maxOccupancy: 100,
      occupancyPercentage: 5.0,
    };
    const result = occupancySchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});

describe("updateOccupancyLimitSchema", () => {
  it("should parse a valid update dto", () => {
    const result = updateOccupancyLimitSchema.safeParse({ maxOccupancy: 150 });
    expect(result.success).toBe(true);
  });

  it("should reject maxOccupancy of 0", () => {
    const result = updateOccupancyLimitSchema.safeParse({ maxOccupancy: 0 });
    expect(result.success).toBe(false);
  });

  it("should reject negative maxOccupancy", () => {
    const result = updateOccupancyLimitSchema.safeParse({ maxOccupancy: -1 });
    expect(result.success).toBe(false);
  });

  it("should reject missing maxOccupancy", () => {
    const result = updateOccupancyLimitSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
