import { describe, expect, it } from "bun:test";
import { formatCurrency, formatDateTime } from "./formatting";

describe("formatCurrency", () => {
  it("should format a whole number as BRL currency", () => {
    expect(formatCurrency(1500)).toBe(
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(1500),
    );
  });

  it("should format zero as BRL currency", () => {
    expect(formatCurrency(0)).toBe(
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(0),
    );
  });

  it("should format a decimal number as BRL currency", () => {
    expect(formatCurrency(99.9)).toBe(
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(99.9),
    );
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
