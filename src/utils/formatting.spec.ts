import { describe, expect, it } from "bun:test";
import { formatCurrency, formatDateTime, formatPlate } from "./formatting";

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

describe("formatPlate", () => {
  it("should format a long plate by adding a hyphen after the 4th character and converting to uppercase", () => {
    expect(formatPlate("abcd1234")).toBe("ABCD-1234");
    expect(formatPlate("xyz5678")).toBe("XYZ5-678");
  });

  it("should remove spaces and special characters before applying the mask", () => {
    expect(formatPlate("A B-C D 1234")).toBe("ABCD-1234");
    expect(formatPlate("!@#XYZ5678")).toBe("XYZ5-678");
  });

  it("should return only uppercase text if the plate has fewer than 7 characters", () => {
    expect(formatPlate("abc")).toBe("ABC");
    expect(formatPlate("teste")).toBe("TESTE");
  });

  it("should return a hyphen '-' for empty strings", () => {
    expect(formatPlate("")).toBe("-");
    expect(formatPlate("   ")).toBe("-");
  });

  it("should return a hyphen '-' for non-string values", () => {
    expect(formatPlate(null)).toBe("-");
    expect(formatPlate(undefined)).toBe("-");
    expect(formatPlate(1234567)).toBe("-");
  });
});
