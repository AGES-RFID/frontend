import type { GraphSeries } from "./types";

export function getMaxValue(series: GraphSeries[]) {
  const values = series.flatMap((line) =>
    line.points.map((point) => point.value),
  );

  return values.length === 0 ? 0 : Math.max(...values);
}

export function getDateDomain(series: GraphSeries[]): [Date, Date] {
  const dates = series.flatMap((line) =>
    line.points.map((point) => new Date(point.timestamp)),
  );

  if (dates.length === 0) return [new Date(), new Date()];

  const min = Math.min(...dates.map(Number));
  const max = Math.max(...dates.map(Number));

  return [new Date(min), new Date(max)];
}
