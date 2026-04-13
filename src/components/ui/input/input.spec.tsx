import { afterEach, describe, expect, it, mock } from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { Input } from ".";

describe("Input component", () => {
  afterEach(cleanup);

  // ── Input vazio ──────────────────────────────────────────────────────

  it("should render with a label", () => {
    render(<Input label="Nome" />);
    expect(screen.getByText("Nome")).toBeDefined();
  });

  it("should render with a placeholder", () => {
    render(<Input placeholder="Digite seu nome" />);
    expect(screen.getByPlaceholderText("Digite seu nome")).toBeDefined();
  });

  it("should accept user input when variant is default", () => {
    render(<Input variant="default" placeholder="Nome" />);
    const input = screen.getByPlaceholderText("Nome") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "João" } });
    expect(input.value).toBe("João");
  });

  it("should trigger the onChange event", () => {
    const handleChange = mock();
    render(
      <Input onChange={handleChange} variant="default" placeholder="Nome" />,
    );
    const input = screen.getByPlaceholderText("Nome") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "João" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls.at(0)?.at(0)?.target.value).toBe("João");
  });

  // ── Disabled variant ─────────────────────────────────────────────────────

  it("should be disabled when variant is disabled", () => {
    render(<Input variant="disabled" placeholder="Bloqueado" />);
    const input = screen.getByPlaceholderText("Bloqueado") as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it("should have the disabled attribute when variant is disabled", () => {
    render(<Input variant="disabled" placeholder="Bloqueado" />);
    const input = screen.getByPlaceholderText("Bloqueado") as HTMLInputElement;
    // The HTML disabled attribute prevents real browser interaction
    expect(input.disabled).toBe(true);
  });

  // ── With-button variant ──────────────────────────────────────────────────

  it("should render the '+' button when variant is with-button", () => {
    render(<Input variant="with-button" />);
    expect(screen.getByRole("button", { name: /adicionar/i })).toBeDefined();
  });

  it("should call onButtonClick when the '+' button is clicked", () => {
    const handleButtonClick = mock();
    render(<Input variant="with-button" onButtonClick={handleButtonClick} />);
    const button = screen.getByRole("button", { name: /adicionar/i });
    button.click();
    expect(handleButtonClick).toHaveBeenCalled();
  });

  it("should NOT render the '+' button when variant is default", () => {
    render(<Input variant="default" />);
    const button = screen.queryByRole("button", { name: /adicionar/i });
    expect(button).toBeNull();
  });
});
