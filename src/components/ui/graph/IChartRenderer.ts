import type { GraphData } from "./types";

export type ChartRenderParams = {
  svgElement: SVGSVGElement;
  data: GraphData[];
  width: number;
  height: number;
};

export interface IChartRenderer {
  render(params: ChartRenderParams): void;
  destroy(): void;
}
