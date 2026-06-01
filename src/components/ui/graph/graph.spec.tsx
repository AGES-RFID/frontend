import { describe, expect, it, afterEach } from "bun:test";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Graph } from ".";

const mockData = [
  { hour: "10", entry: 20, exit: 15 },
  { hour: "11", entry: 35, exit: 28 },
  { hour: "12", entry: 10, exit: 40 },
];

afterEach(() => {
  cleanup();
});

describe("Graph", () => {
  it("should render graph title", () => {
    render(<Graph />);

    expect(screen.getByText(/fluxo de veículos por hora/i)).toBeTruthy();
  });

  it("should render loading message when data is empty", () => {
    render(<Graph data={[]} />);

    expect(screen.getByText(/carregando dados/i)).toBeTruthy();
  });

  it("should render the svg when data is provided", () => {
    render(<Graph data={mockData} width={800} height={400} />);

    const svg = document.querySelector("svg");
    expect(svg).not.toBeNull();
  });

  it("should render the entry legend label", () => {
    render(<Graph data={mockData} />);

    expect(screen.getByText("Entradas")).toBeTruthy();
  });

  it("should render the exit legend label", () => {
    render(<Graph data={mockData} />);

    expect(screen.getByText("Saídas")).toBeTruthy();
  });

  it("should unmount without throwing", () => {
    const { unmount } = render(
      <Graph data={mockData} width={800} height={400} />,
    );

    expect(() => unmount()).not.toThrow();
  });
});
