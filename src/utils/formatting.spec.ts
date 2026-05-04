import { describe, expect, it } from "bun:test";
import { formatCurrency, formatDateTime } from "./formatting";

describe("formatCurrency", () => {
  it("should format a whole number as BRL currency", () => {
    expect(formatCurrency(1500)).toBe("R$ 1.500,00");
  });

  it("should format zero as BRL currency", () => {
    expect(formatCurrency(0)).toBe("R$ 0,00");
  });

  it("should format a decimal number as BRL currency", () => {
    expect(formatCurrency(99.9)).toBe("R$ 99,90");
  });
});

describe("formatDateTime", () => {
  it("should format a valid ISO date string", () => {
    const result = formatDateTime("2024-06-15T10:30:00");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("should return the original value when the date string is invalid", () => {
    expect(formatDateTime("not-a-date")).toBe("not-a-date");
  });
});
