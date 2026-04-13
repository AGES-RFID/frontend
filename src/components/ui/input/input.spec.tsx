import { describe, expect, it, mock, afterEach } from "bun:test";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

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

  it("should call onBlur without validation for the default input", () => {
    const handleBlur = mock();

    render(
      <Input
        placeholder="Nome"
        value=""
        onBlur={handleBlur}
        onChange={mock()}
      />,
    );
    const input = screen.getByPlaceholderText("Nome");

    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalled();
    expect(screen.queryByText(/inválido/i)).toBeNull();

    fireEvent.blur(input, { target: { value: "João" } });

    expect(handleBlur).toHaveBeenCalled();
    expect(screen.queryByText(/inválido/i)).toBeNull();
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

  it("should mask cpf input and show validation errors on blur", () => {
    const handleChange = mock();

    render(
      <Input
        label="CPF"
        placeholder="Digite o CPF"
        mask="cpf"
        onChange={handleChange}
      />,
    );

    const input = screen.getByPlaceholderText("Digite o CPF");
    fireEvent.change(input, { target: { value: "12345678909" } });

    expect(handleChange.mock.calls[0]?.[0].target.value).toBe("123.456.789-09");

    fireEvent.blur(input, { target: { value: "123.456.789-09" } });
    expect(screen.queryByText("CPF inválido.")).toBeNull();

    fireEvent.blur(input, { target: { value: "11111111111" } });
    expect(screen.getByText("CPF inválido.")).toBeDefined();
  });

  it("should mask phone input and validate the value on blur", () => {
    const handleChange = mock();

    render(
      <Input
        label="Telefone"
        placeholder="Digite o telefone"
        mask="phone"
        onChange={handleChange}
      />,
    );

    const input = screen.getByPlaceholderText("Digite o telefone");
    fireEvent.change(input, { target: { value: "1" } });
    expect(handleChange.mock.calls[0]?.[0].target.value).toBe("(1");

    fireEvent.change(input, { target: { value: "119876" } });
    expect(handleChange.mock.calls[1]?.[0].target.value).toBe("(11) 9876");

    fireEvent.change(input, { target: { value: "1198765432" } });
    expect(handleChange.mock.calls[2]?.[0].target.value).toBe("(11) 9876-5432");

    fireEvent.change(input, { target: { value: "11987654321" } });
    expect(handleChange.mock.calls[3]?.[0].target.value).toBe(
      "(11) 98765-4321",
    );

    fireEvent.blur(input, { target: { value: "1198765" } });
    expect(screen.getByText("Telefone inválido.")).toBeDefined();
  });

  it("should validate email and clear the error on focus", () => {
    render(<Input label="Email" type="email" placeholder="Digite seu email" />);

    const input = screen.getByPlaceholderText("Digite seu email");
    fireEvent.blur(input, { target: { value: "invalid-email" } });
    expect(screen.getByText("Email inválido.")).toBeDefined();

    fireEvent.focus(input);
    expect(screen.queryByText("Email inválido.")).toBeNull();
  });

  it("should validate password length", () => {
    render(
      <Input
        label="Senha"
        type="password"
        placeholder="Digite sua senha"
        showPasswordToggle
        value="1234567"
        onChange={mock()}
      />,
    );

    const input = screen.getByPlaceholderText("Digite sua senha");
    fireEvent.blur(input, { target: { value: "1234567" } });
    expect(
      screen.getByText("A senha deve ter no mínimo 8 caracteres."),
    ).toBeDefined();

    fireEvent.focus(input);
    expect(
      screen.queryByText("A senha deve ter no mínimo 8 caracteres."),
    ).toBeNull();
  });

  it("should clear password validation when the value is empty", () => {
    const handleBlur = mock();

    render(
      <Input
        label="Senha"
        type="password"
        placeholder="Senha vazia"
        value=""
        onChange={mock()}
        onBlur={handleBlur}
      />,
    );

    fireEvent.blur(screen.getByPlaceholderText("Senha vazia"));

    expect(handleBlur).toHaveBeenCalled();
    expect(screen.queryByText(/mínimo 8 caracteres/i)).toBeNull();
  });

  it("should toggle password visibility", () => {
    render(
      <Input
        label="Senha"
        type="password"
        placeholder="Digite sua senha"
        showPasswordToggle
        value="12345678"
        onChange={mock()}
      />,
    );

    const toggleButton = screen.getByRole("button", { name: /mostrar senha/i });
    fireEvent.click(toggleButton);

    expect(
      (screen.getByPlaceholderText("Digite sua senha") as HTMLInputElement)
        .type,
    ).toBe("text");
  });
});
