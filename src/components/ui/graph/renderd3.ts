import * as d3 from "d3";
import type { ChartRenderParams, IChartRenderer } from "./IChartRenderer";
import type { GraphPoint } from "./types";
import { getDateDomain, getMaxValue } from "./utils";

const DEFAULT_SERIES_COLORS = [
  "var(--color-blue)",
  "var(--color-dark-orange)",
  "var(--color-teal)",
  "var(--color-green)",
  "var(--color-fuscia)",
  "var(--color-dark-teal)",
  "var(--color-light-blue)",
  "var(--color-dark-fuscia)",
];

export function getColor(
  defaultColor: string | undefined,
  index: number,
): string {
  return (
    // biome-ignore lint/style/noNonNullAssertion: we ensure this via the fallback array length
    defaultColor ?? DEFAULT_SERIES_COLORS[index % DEFAULT_SERIES_COLORS.length]!
  );
}

export class D3ChartRenderer implements IChartRenderer {
  render({ svgElement, series, width, height }: ChartRenderParams): void {
    const svg = d3.select(svgElement);
    svg.selectAll("*").remove();

    const margin = { top: 24, right: 24, bottom: 40, left: 48 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const rawMax = getMaxValue(series);
    const [domainStart, domainEnd] = getDateDomain(series);

    if (series.length === 0 || domainStart.getTime() === domainEnd.getTime())
      return;

    const maxValue = rawMax === 0 ? 10 : rawMax + 5;
    const roundedMax = Math.ceil(maxValue / 5) * 5;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleTime()
      .domain([domainStart, domainEnd])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, roundedMax])
      .range([innerHeight, 0]);

    const yTicks = d3.range(0, roundedMax + 1, 5);

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .selectAll("line")
      .data(yTicks)
      .join("line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "var(--color-light-gray)")
      .attr("stroke-dasharray", "4,4");

    // X axis
    const timeFormatter = d3.timeFormat("%H:%M");

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickSize(0)
          .tickFormat((tick) =>
            timeFormatter(
              tick instanceof Date ? tick : new Date(tick.valueOf()),
            ),
          ),
      )
      .call((selection) => selection.select(".domain").remove())
      .selectAll("text")
      .attr("dy", "1.2em")
      .style("fill", "var(--color-gray)")
      .style("font-size", "12px");

    // Y axis
    const yFormatter = d3.format("d");

    g.append("g")
      .call(
        d3
          .axisLeft(yScale)
          .tickValues(yTicks)
          .tickSize(0)
          .tickFormat(yFormatter),
      )
      .call((selection) => selection.select(".domain").remove())
      .selectAll("text")
      .attr("dx", "-0.6em")
      .style("fill", "var(--color-gray)")
      .style("font-size", "12px");

    // Lines and dots per series
    for (const [index, lineSeries] of series.entries()) {
      const color = getColor(lineSeries.color, index);

      const line = d3
        .line<GraphPoint>()
        .x((point) => xScale(new Date(point.timestamp)))
        .y((point) => yScale(point.value))
        .curve(d3.curveMonotoneX);

      g.append("path")
        .datum(lineSeries.points)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2.5)
        .attr("d", line);

      g.append("g")
        .attr("class", "series-points")
        .selectAll("circle")
        .data(lineSeries.points)
        .join("circle")
        .attr("cx", (point) => xScale(new Date(point.timestamp)))
        .attr("cy", (point) => yScale(point.value))
        .attr("r", 4)
        .attr("fill", color);
    }
  }

  destroy(): void {
    // cleanup is handled in render() via svg.selectAll("*").remove()
  }
}
