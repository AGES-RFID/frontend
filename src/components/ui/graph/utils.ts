import type { GraphData } from "./types";

export function getMaxValue(data: GraphData[]) {
  return Math.max(...data.flatMap((item) => [item.entry, item.exit]));
}

export function getLast12Hours() {
  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date();

    date.setHours(date.getHours() - index);

    return date.getHours().toString();
  });
}
