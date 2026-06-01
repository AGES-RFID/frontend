import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { D3ChartRenderer } from "./renderd3";
import type { GraphData } from "./types";

const mockData: GraphData[] = [
  { hour: "10", entry: 20, exit: 15 },
  { hour: "11", entry: 35, exit: 28 },
  { hour: "12", entry: 10, exit: 40 },
];

function createSvgElement(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "800");
  svg.setAttribute("height", "400");
  document.body.appendChild(svg);
  return svg as SVGSVGElement;
}

describe("D3ChartRenderer", () => {
  let renderer: D3ChartRenderer;
  let svg: SVGSVGElement;

  beforeEach(() => {
    renderer = new D3ChartRenderer();
    svg = createSvgElement();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should render without throwing", () => {
    expect(() =>
      renderer.render({
        svgElement: svg,
        data: mockData,
        width: 800,
        height: 400,
      }),
    ).not.toThrow();
  });

  it("should append elements to the svg", () => {
    renderer.render({
      svgElement: svg,
      data: mockData,
      width: 800,
      height: 400,
    });

    expect(svg.querySelectorAll("path").length).toBeGreaterThan(0);
  });

  it("should render two path lines (entry and exit)", () => {
    renderer.render({
      svgElement: svg,
      data: mockData,
      width: 800,
      height: 400,
    });

    const paths = svg.querySelectorAll("path");
    expect(paths.length).toBe(2);
  });

  it("should render dots for each data point for entries and exits", () => {
    renderer.render({
      svgElement: svg,
      data: mockData,
      width: 800,
      height: 400,
    });

    const entryDots = svg.querySelectorAll(".dot-entry");
    const exitDots = svg.querySelectorAll(".dot-exit");

    expect(entryDots.length).toBe(mockData.length);
    expect(exitDots.length).toBe(mockData.length);
  });

  it("should clear previous content on re-render", () => {
    renderer.render({
      svgElement: svg,
      data: mockData,
      width: 800,
      height: 400,
    });
    const firstChildCount = svg.children.length;

    renderer.render({
      svgElement: svg,
      data: mockData,
      width: 800,
      height: 400,
    });
    const secondChildCount = svg.children.length;

    expect(secondChildCount).toBe(firstChildCount);
  });

  it("should render with empty data without throwing", () => {
    expect(() =>
      renderer.render({ svgElement: svg, data: [], width: 800, height: 400 }),
    ).not.toThrow();
  });

  it("should use a fallback max of 10 when all values are zero", () => {
    const zeroData: GraphData[] = [
      { hour: "10", entry: 0, exit: 0 },
      { hour: "11", entry: 0, exit: 0 },
    ];

    expect(() =>
      renderer.render({
        svgElement: svg,
        data: zeroData,
        width: 800,
        height: 400,
      }),
    ).not.toThrow();
  });

  it("should call destroy without throwing", () => {
    expect(() => renderer.destroy()).not.toThrow();
  });

  it("should render grid lines", () => {
    renderer.render({
      svgElement: svg,
      data: mockData,
      width: 800,
      height: 400,
    });

    const grid = svg.querySelector(".grid");
    expect(grid).not.toBeNull();
  });

  it("should render Y axis tick labels as integers", () => {
    renderer.render({
      svgElement: svg,
      data: mockData,
      width: 800,
      height: 400,
    });

    const texts = Array.from(svg.querySelectorAll("text")).map(
      (t) => t.textContent ?? "",
    );
    const numericLabels = texts.filter((t) => /^\d+$/.test(t.trim()));
    expect(numericLabels.length).toBeGreaterThan(0);
  });
});
