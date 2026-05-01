import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "bun:test";
import { PricingTable } from "./PricingTable";

afterEach(() => {
  cleanup();
});

describe("PricingTable", () => {
  it("should render without crashing", () => {
    const { container } = render(<PricingTable />);
    expect(container).toBeDefined();
  });

  it("should render the table headers", () => {
    render(<PricingTable />);
    expect(screen.getByText("Tempo")).toBeDefined();
    expect(screen.getByText("Valor")).toBeDefined();
  });

  it("should render all row labels", () => {
    render(<PricingTable />);
    expect(screen.getByText("Até 15 minutos")).toBeDefined();
    expect(screen.getByText("Até 3 horas")).toBeDefined();
    expect(screen.getByText("Hora adicional")).toBeDefined();
  });

  it("should render the default values when no data is provided", () => {
    render(<PricingTable />);
    expect(screen.getByText("Isento")).toBeDefined();
    expect(screen.getByText("R$ 15,00")).toBeDefined();
    expect(screen.getByText("R$ 5,00")).toBeDefined();
  });

  it("should override default values with provided data", () => {
    render(
      <PricingTable
        data={{
          ate15Minutos: "Grátis",
          ate3Horas: "R$ 20,00",
          horaAdicional: "R$ 8,00",
        }}
      />,
    );
    expect(screen.getByText("Grátis")).toBeDefined();
    expect(screen.getByText("R$ 20,00")).toBeDefined();
    expect(screen.getByText("R$ 8,00")).toBeDefined();
  });

  it("should use default value for fields not provided in data", () => {
    render(<PricingTable data={{ ate15Minutos: "Grátis" }} />);
    expect(screen.getByText("Grátis")).toBeDefined();
    expect(screen.getByText("R$ 15,00")).toBeDefined();
    expect(screen.getByText("R$ 5,00")).toBeDefined();
  });

  it("should apply additional className to the container", () => {
    const { container } = render(<PricingTable className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
