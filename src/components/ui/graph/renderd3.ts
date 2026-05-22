import * as d3 from "d3";
import type { GraphData } from "./types";

type RenderD3Props = {
  svgElement: SVGSVGElement;
  data: GraphData[];
  width: number;
  height: number;
};

export function renderD3({ svgElement, data, width, height }: RenderD3Props) {
  const svg = d3.select(svgElement);

  svg.selectAll("*").remove();

  const _margin = {
    top: 40,
    right: 40,
    bottom: 40,
    left: 40,
  };
}
