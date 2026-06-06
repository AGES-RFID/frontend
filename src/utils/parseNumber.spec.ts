import { describe, expect, it } from "bun:test";
import { parseNumber } from "./parseNumber";

describe("parseNumber", () => {
  it("should parse a valid number", () => {
    const result = parseNumber("42");
    expect(result).toBe(42);
  });

  it("should return null for an empty string", () => {
    const result = parseNumber("");
    expect(result).toBeNull();
  });

  it("should return null for a string with only whitespace", () => {
    const result = parseNumber("   ");
    expect(result).toBeNull();
  });

  it("should return null for an invalid number", () => {
    const result = parseNumber("abc");
    expect(result).toBeNull();
  });
});
