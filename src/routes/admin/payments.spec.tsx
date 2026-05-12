import { describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import { Payments } from "./payments";

describe("Payments", () => {
  it("should render the payments page", () => {
    render(<Payments />);

    expect(screen.getByText("Cobrança")).toBeDefined();
    expect(screen.getByText("Valores do estacionamento")).toBeDefined();
    expect(screen.getByText("Editar Valores")).toBeDefined();
    expect(screen.getByText("Até 15 minutos")).toBeDefined();
    expect(screen.getByText("Até 3 horas")).toBeDefined();
    expect(screen.getByText("Hora adicional")).toBeDefined();
  });
});
