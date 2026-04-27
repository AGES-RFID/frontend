import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { Login } from "./login";

function renderLogin() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/login"]}>
        <Login />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("Login component", () => {
  afterEach(cleanup);

  it("should render the email input", () => {
    renderLogin();
    expect(screen.getByPlaceholderText("Digite seu email")).toBeInTheDocument();
  });

  it("should render the password input", () => {
    renderLogin();
    expect(screen.getByPlaceholderText("Digite sua senha")).toBeInTheDocument();
  });

  it("should render the submit button", () => {
    renderLogin();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
  });

  it("should render the register button", () => {
    renderLogin();
    expect(
      screen.getByRole("button", { name: "Criar nova conta" }),
    ).toBeInTheDocument();
  });

  it("should render the forgot password button", () => {
    renderLogin();
    expect(
      screen.getByRole("button", { name: "Esqueci a senha" }),
    ).toBeInTheDocument();
  });

  it("should update email field value on input", () => {
    renderLogin();
    const emailInput = screen.getByPlaceholderText(
      "Digite seu email",
    ) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput.value).toBe("test@example.com");
  });

  it("should update password field value on input", () => {
    renderLogin();
    const passwordInput = screen.getByPlaceholderText(
      "Digite sua senha",
    ) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    expect(passwordInput.value).toBe("password123");
  });

  it("should show validation error when email is invalid on blur", () => {
    renderLogin();
    const emailInput = screen.getByPlaceholderText("Digite seu email");
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.blur(emailInput);
    expect(screen.getByText("Email inválido")).toBeInTheDocument();
  });

  it("should not show validation error when email is valid on blur", () => {
    renderLogin();
    const emailInput = screen.getByPlaceholderText("Digite seu email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.blur(emailInput);
    expect(screen.queryByText("Email inválido")).not.toBeInTheDocument();
  });

  it("should clear email error when a valid email is typed after an invalid one", () => {
    renderLogin();
    const emailInput = screen.getByPlaceholderText("Digite seu email");
    fireEvent.change(emailInput, { target: { value: "bad" } });
    fireEvent.blur(emailInput);
    expect(screen.getByText("Email inválido")).toBeInTheDocument();
    fireEvent.change(emailInput, { target: { value: "good@example.com" } });
    expect(screen.queryByText("Email inválido")).not.toBeInTheDocument();
  });

  it("should trigger register navigation without throwing", async () => {
    renderLogin();
    await act(async () => {
      screen.getByRole("button", { name: "Criar nova conta" }).click();
    });
  });

  it("should trigger forgot password without throwing", async () => {
    renderLogin();
    await act(async () => {
      screen.getByRole("button", { name: "Esqueci a senha" }).click();
    });
  });
});
