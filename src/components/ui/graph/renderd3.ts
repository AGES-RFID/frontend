import * as d3 from "d3";
import type { IChartRenderer, ChartRenderParams } from "./IChartRenderer";
import { getMaxValue } from "./utils";

export class D3ChartRenderer implements IChartRenderer {
  render({ svgElement, data, width, height }: ChartRenderParams): void {
    const svg = d3.select(svgElement);
    svg.selectAll("*").remove();

    const margin = { top: 40, right: 40, bottom: 40, left: 48 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const rawMax = getMaxValue(data);
    const maxValue = rawMax === 0 ? 10 : rawMax + 5;
    const roundedMax = Math.ceil(maxValue / 5) * 5;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scalePoint<string>()
      .domain(data.map((d) => d.hour))
      .range([0, innerWidth])
      .padding(0.1);

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
      .attr("stroke", "var(--color-light-gray, #e5e7eb)")
      .attr("stroke-dasharray", "4,4");

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickSize(0))
      .call((axis) => axis.select(".domain").remove())
      .selectAll("text")
      .attr("dy", "1.2em")
      .style("fill", "var(--color-gray, #6b7280)")
      .style("font-size", "12px");

    // Y axis
    g.append("g")
      .call(
        d3
          .axisLeft(yScale)
          .tickValues(yTicks)
          .tickSize(0)
          .tickFormat(d3.format("d")),
      )
      .call((axis) => axis.select(".domain").remove())
      .selectAll("text")
      .attr("dx", "-0.6em")
      .style("fill", "var(--color-gray, #6b7280)")
      .style("font-size", "12px");

    // Entry line
    const entryLine = d3
      .line<(typeof data)[0]>()
      .x((d) => xScale(d.hour)!)
      .y((d) => yScale(d.entry))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "var(--color-blue)")
      .attr("stroke-width", 2.5)
      .attr("d", entryLine);

    // Exit line
    const exitLine = d3
      .line<(typeof data)[0]>()
      .x((d) => xScale(d.hour)!)
      .y((d) => yScale(d.exit))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "var(--color-dark-orange)")
      .attr("stroke-width", 2.5)
      .attr("d", exitLine);

    // Dots — entries
    g.selectAll(".dot-entry")
      .data(data)
      .join("circle")
      .attr("class", "dot-entry")
      .attr("cx", (d) => xScale(d.hour)!)
      .attr("cy", (d) => yScale(d.entry))
      .attr("r", 4)
      .attr("fill", "var(--color-blue)");

    // Dots — exits
    g.selectAll(".dot-exit")
      .data(data)
      .join("circle")
      .attr("class", "dot-exit")
      .attr("cx", (d) => xScale(d.hour)!)
      .attr("cy", (d) => yScale(d.exit))
      .attr("r", 4)
      .attr("fill", "var(--color-dark-orange)");
  }

  destroy(): void {
    // cleanup is handled in render() via svg.selectAll("*").remove()
  }
}
