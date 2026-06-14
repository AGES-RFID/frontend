import { describe, expect, it } from "bun:test";
import { getMaxValue, getDateDomain } from "./utils";
import type { GraphSeries } from "./types";

const makePoint = (timestamp: string, value: number) => ({ timestamp, value });

const series: GraphSeries[] = [
  {
    name: "Série A",
    points: [
      makePoint("2026-06-06T10:00:00", 20),
      makePoint("2026-06-06T11:00:00", 35),
      makePoint("2026-06-06T12:00:00", 10),
    ],
  },
  {
    name: "Série B",
    points: [
      makePoint("2026-06-06T10:00:00", 15),
      makePoint("2026-06-06T11:00:00", 28),
      makePoint("2026-06-06T12:00:00", 40),
    ],
  },
];

describe("getMaxValue", () => {
  it("deve retornar o maior valor entre todas as séries", () => {
    expect(getMaxValue(series)).toBe(40);
  });

  it("deve retornar 0 quando não há séries", () => {
    expect(getMaxValue([])).toBe(0);
  });

  it("deve retornar 0 quando as séries estão vazias", () => {
    expect(getMaxValue([{ name: "X", points: [] }])).toBe(0);
  });
});

describe("getDateDomain", () => {
  it("deve retornar o intervalo de datas entre todas as séries", () => {
    const [min, max] = getDateDomain(series);
    expect(min.toISOString()).toBe("2026-06-06T10:00:00.000Z");
    expect(max.toISOString()).toBe("2026-06-06T12:00:00.000Z");
  });

  it("deve retornar [now, now] quando não há séries", () => {
    const [min, max] = getDateDomain([]);
    expect(min.getTime()).toBeGreaterThan(0);
    expect(max.getTime()).toBeGreaterThan(0);
  });
});
