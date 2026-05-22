import { getLast12Hours, getMaxValue } from "./utils";

describe("utils", () => {
  describe("getLast12Hours", () => {
    it("should return 12 hours", () => {
      const result = getLast12Hours();

      expect(result).toHaveLength(12);
    });

    it("should return strings", () => {
      const result = getLast12Hours();

      expect(typeof result[0]).toBe("string");
    });
  });

  describe("getMaxValue", () => {
    it("should return max value", () => {
      const result = getMaxValue([
        {
          hour: "14",
          entry: 20,
          exit: 35,
        },
        {
          hour: "13",
          entry: 10,
          exit: 15,
        },
      ]);

      expect(result).toBe(35);
    });
  });
});
