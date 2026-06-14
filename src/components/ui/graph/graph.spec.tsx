import { describe, expect, it, afterEach } from "bun:test";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Graph } from ".";
import type { GraphSeries } from "./types";

const mockSeries: GraphSeries[] = [
  {
    name: "Entradas",
    color: "var(--color-blue)",
    points: [
      { timestamp: "2026-06-06T10:00:00", value: 20 },
      { timestamp: "2026-06-06T11:00:00", value: 35 },
    ],
  },
  {
    name: "Saídas",
    color: "var(--color-dark-orange)",
    points: [
      { timestamp: "2026-06-06T10:00:00", value: 15 },
      { timestamp: "2026-06-06T11:00:00", value: 28 },
    ],
  },
];

afterEach(() => {
  cleanup();
});

describe("Graph", () => {
  it("renderiza o título", () => {
    render(<Graph title="Fluxo de veículos" series={mockSeries} />);
    expect(screen.getByText(/fluxo de veículos/i)).toBeTruthy();
  });

  it("renderiza os itens da legenda", () => {
    render(<Graph series={mockSeries} />);
    expect(screen.getByText("Entradas")).toBeTruthy();
    expect(screen.getByText("Saídas")).toBeTruthy();
  });

  it("exibe mensagem vazia quando não há séries", () => {
    render(<Graph series={[]} />);
    expect(screen.getByText(/sem dados para exibir/i)).toBeTruthy();
  });

  it("renderiza o svg quando há dados", () => {
    render(<Graph series={mockSeries} width={800} height={400} />);
    const svg = document.querySelector("svg");
    expect(svg).not.toBeNull();
  });

  it("desmonta sem lançar erro", () => {
    const { unmount } = render(<Graph series={mockSeries} />);
    expect(() => unmount()).not.toThrow();
  });
});
