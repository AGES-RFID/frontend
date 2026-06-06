import type { GraphSeries } from "./types";

export type ChartRenderParams = {
  svgElement: SVGSVGElement;
  series: GraphSeries[];
  width: number;
  height: number;
};

export interface IChartRenderer {
  render(params: ChartRenderParams): void;
  destroy(): void;
}
