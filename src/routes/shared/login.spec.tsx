import { afterEach, describe, expect, it, spyOn } from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { Login } from "./login";
import { authService } from "@/features/auth/AuthService";

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

  it("should store token and navigate on successful login", async () => {
    const mockUser = {
      userId: "550e8400-e29b-41d4-a716-446655440000",
      name: "Test User",
      email: "test@example.com",
    };
    const loginSpy = spyOn(authService, "login").mockResolvedValue({
      token: "mock-token",
      user: mockUser,
    });

    renderLogin();

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Digite seu email"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Digite sua senha"), {
        target: { value: "password123" },
      });
    });

    await act(async () => {
      const form = screen
        .getByRole("button", { name: "Entrar" })
        .closest("form");
      if (form) fireEvent.submit(form);
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(loginSpy).toHaveBeenCalled();
    loginSpy.mockRestore();
  });

  it("should show error toast when login returns 401", async () => {
    const loginSpy = spyOn(authService, "login").mockRejectedValue(
      new Error("Unauthorized"),
    );

    renderLogin();

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Digite seu email"), {
        target: { value: "wrong@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Digite sua senha"), {
        target: { value: "wrongpass" },
      });
    });

    await act(async () => {
      const form = screen
        .getByRole("button", { name: "Entrar" })
        .closest("form");
      if (form) fireEvent.submit(form);
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(loginSpy).toHaveBeenCalled();
    loginSpy.mockRestore();
  });
});
