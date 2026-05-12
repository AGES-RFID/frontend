import { afterEach, describe, expect, it } from "bun:test";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import { Payments } from "./payments";

describe("Payments", () => {
  afterEach(cleanup);

  it("should render the payments page", () => {
    render(<Payments />);

    expect(screen.getByText("Cobrança")).toBeDefined();
    expect(screen.getByText("Valores do estacionamento")).toBeDefined();
    expect(screen.getByText("Editar Valores")).toBeDefined();
    expect(screen.getByText("Até 15 minutos")).toBeDefined();
    expect(screen.getByText("Até 3 horas")).toBeDefined();
    expect(screen.getByText("Hora adicional")).toBeDefined();
  });

  it("should open the edit values modal when clicking the button", async () => {
    render(<Payments />);

    fireEvent.click(screen.getByRole("button", { name: "Editar Valores" }));

    await waitFor(() => {
      expect(screen.getByText("Editar valores")).toBeDefined();
      expect(screen.getByText("Modal de edição")).toBeDefined();
    });
  });

  it("should close the edit values modal when clicking the backdrop", async () => {
    render(<Payments />);

    fireEvent.click(screen.getByRole("button", { name: "Editar Valores" }));

    await waitFor(() => {
      expect(screen.getByText("Modal de edição")).toBeDefined();
    });

    fireEvent.click(screen.getByLabelText("Fechar modal"));

    await waitFor(() => {
      expect(screen.queryByText("Modal de edição")).toBeNull();
    });
  });
});
