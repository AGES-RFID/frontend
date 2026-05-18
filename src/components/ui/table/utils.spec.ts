import { describe, expect, it } from "bun:test";

import { compareTableValues, formatTableCellValue } from "./utils";

describe("table utils", () => {
  describe("formatTableCellValue", () => {
    it("returns '-' for nullish or empty values", () => {
      expect(formatTableCellValue(null)).toBe("-");
      expect(formatTableCellValue(undefined)).toBe("-");
      expect(formatTableCellValue("")).toBe("-");
    });

    it("returns string representation for valid values", () => {
      expect(formatTableCellValue(123)).toBe("123");
      expect(formatTableCellValue(false)).toBe("false");
    });
  });

  describe("compareTableValues", () => {
    it("returns 0 for equal values", () => {
      expect(compareTableValues("same", "same", "asc")).toBe(0);
    });

    it("orders nullish values based on direction", () => {
      expect(compareTableValues(null, "a", "asc")).toBe(-1);
      expect(compareTableValues(null, "a", "desc")).toBe(1);
      expect(compareTableValues("a", undefined, "asc")).toBe(1);
      expect(compareTableValues("a", undefined, "desc")).toBe(-1);
    });

    it("sorts dates correctly", () => {
      expect(
        compareTableValues("2024-01-01", "2025-01-01", "asc"),
      ).toBeLessThan(0);
      expect(
        compareTableValues("2024-01-01", "2025-01-01", "desc"),
      ).toBeGreaterThan(0);
    });

    it("sorts numbers correctly", () => {
      expect(compareTableValues(2, 10, "asc")).toBeLessThan(0);
      expect(compareTableValues(2, 10, "desc")).toBeGreaterThan(0);
    });

    it("falls back to locale string comparison", () => {
      expect(compareTableValues("ábaco", "zebra", "asc")).toBeLessThan(0);
      expect(compareTableValues("item10", "item2", "asc")).toBeGreaterThan(0);
      expect(compareTableValues("abc", "def", "desc")).toBeGreaterThan(0);
    });
  });
});
