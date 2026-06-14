import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { D3ChartRenderer } from "./renderd3";
import type { GraphSeries } from "./types";

const mockSeries: GraphSeries[] = [
  {
    name: "Entradas",
    color: "var(--color-blue)",
    points: [
      { timestamp: "2026-06-06T10:00:00", value: 20 },
      { timestamp: "2026-06-06T11:00:00", value: 35 },
      { timestamp: "2026-06-06T12:00:00", value: 10 },
    ],
  },
  {
    name: "Saídas",
    color: "var(--color-dark-orange)",
    points: [
      { timestamp: "2026-06-06T10:00:00", value: 15 },
      { timestamp: "2026-06-06T11:00:00", value: 28 },
      { timestamp: "2026-06-06T12:00:00", value: 40 },
    ],
  },
];

function createSvg(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "800");
  svg.setAttribute("height", "400");
  document.body.appendChild(svg);
  return svg;
}

describe("D3ChartRenderer", () => {
  let renderer: D3ChartRenderer;
  let svg: SVGSVGElement;

  beforeEach(() => {
    renderer = new D3ChartRenderer();
    svg = createSvg();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renderiza sem lançar erro", () => {
    expect(() =>
      renderer.render({
        svgElement: svg,
        series: mockSeries,
        width: 800,
        height: 400,
      }),
    ).not.toThrow();
  });

  it("renderiza uma <path> por série", () => {
    renderer.render({
      svgElement: svg,
      series: mockSeries,
      width: 800,
      height: 400,
    });
    expect(svg.querySelectorAll("path[stroke-width='2.5']").length).toBe(
      mockSeries.length,
    );
  });

  it("renderiza círculos para todos os pontos de dados", () => {
    renderer.render({
      svgElement: svg,
      series: mockSeries,
      width: 800,
      height: 400,
    });
    const totalPoints = mockSeries.reduce((sum, s) => sum + s.points.length, 0);
    expect(svg.querySelectorAll("circle").length).toBe(totalPoints);
  });

  it("renderiza linhas de grade", () => {
    renderer.render({
      svgElement: svg,
      series: mockSeries,
      width: 800,
      height: 400,
    });
    expect(svg.querySelector(".grid")).not.toBeNull();
  });

  it("não lança erro com séries vazias", () => {
    expect(() =>
      renderer.render({ svgElement: svg, series: [], width: 800, height: 400 }),
    ).not.toThrow();
  });

  it("não lança erro com valores zero", () => {
    const zeroSeries: GraphSeries[] = [
      {
        name: "Zeros",
        points: [
          { timestamp: "2026-06-06T10:00:00", value: 0 },
          { timestamp: "2026-06-06T11:00:00", value: 0 },
        ],
      },
    ];
    expect(() =>
      renderer.render({
        svgElement: svg,
        series: zeroSeries,
        width: 800,
        height: 400,
      }),
    ).not.toThrow();
  });

  it("limpa o conteúdo anterior ao re-renderizar", () => {
    renderer.render({
      svgElement: svg,
      series: mockSeries,
      width: 800,
      height: 400,
    });
    const firstChildCount = svg.children.length;

    renderer.render({
      svgElement: svg,
      series: mockSeries,
      width: 800,
      height: 400,
    });
    const secondChildCount = svg.children.length;

    expect(secondChildCount).toBe(firstChildCount);
  });

  it("destroy não lança erro", () => {
    expect(() => renderer.destroy()).not.toThrow();
  });
});
