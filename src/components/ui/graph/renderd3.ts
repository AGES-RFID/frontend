import * as d3 from "d3";
import type { GraphData } from "./types";
import { getMaxValue } from "./utils";

type RenderD3Props = {
  svgElement: SVGSVGElement;
  data: GraphData[];
  width: number;
  height: number;
};

export function renderD3({ svgElement, data, width, height }: RenderD3Props) {
  const svg = d3.select(svgElement);

  svg.selectAll("*").remove();

  const margin = {
    top: 40,
    right: 40,
    bottom: 40,
    left: 40,
  };

  const maxValue = getMaxValue(data) + 5;

  const xScale = d3
    .scalePoint<string>()
    .domain(data.map((item) => item.hour))
    .range([margin.left, width - margin.right]);

  const yScale = d3
    .scaleLinear()
    .domain([0, maxValue])
    .range([height - margin.bottom, margin.top]);

  svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(xScale));

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale).tickValues(d3.range(0, maxValue + 1, 5)));

  const entryLine = d3
    .line<GraphData>()
    .x((d) => xScale(d.hour)!)
    .y((d) => yScale(d.entry));

  const exitLine = d3
    .line<GraphData>()
    .x((d) => xScale(d.hour)!)
    .y((d) => yScale(d.exit));

  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "var(--color-blue)")
    .attr("stroke-width", 2)
    .attr("d", entryLine);

  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "var(--color-dark-orange)")
    .attr("stroke-width", 2)
    .attr("d", exitLine);
}
