import { describe, expect, it } from "bun:test";
import { tagStatusSchema } from "./tagStatusDto";

describe("tagStatusSchema", () => {
  it("should accept AVAILABLE", () => {
    expect(tagStatusSchema.parse("AVAILABLE")).toBe("AVAILABLE");
  });

  it("should accept IN_USE", () => {
    expect(tagStatusSchema.parse("IN_USE")).toBe("IN_USE");
  });

  it("should accept INACTIVE", () => {
    expect(tagStatusSchema.parse("INACTIVE")).toBe("INACTIVE");
  });

  it("should reject an unknown status value", () => {
    expect(() => tagStatusSchema.parse("UNKNOWN")).toThrow();
  });

  it("should reject an empty string", () => {
    expect(() => tagStatusSchema.parse("")).toThrow();
  });

  it("should reject a lowercase value", () => {
    expect(() => tagStatusSchema.parse("available")).toThrow();
  });
});
