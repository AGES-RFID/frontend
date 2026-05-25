import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import * as ReactRouter from "react-router";
import { MemoryRouter } from "react-router";
import { toast } from "@/components/ui/toast";
import { authService } from "@/features/auth/AuthService";
import { userService } from "@/features/users/UserService";
import { EditProfile } from "./editProfile";

function renderEditProfile(queryClient: QueryClient) {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/profile/edit"]}>
        <EditProfile />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("EditProfile Component", () => {
  let spies: { mockRestore: () => void }[] = [];

  afterEach(() => {
    cleanup();
    for (const spy of spies) {
      if (spy && typeof spy.mockRestore === "function") {
        spy.mockRestore();
      }
    }
    spies = [];
  });

  const mockUser = {
    userId: "123",
    name: "Jair Messias",
    email: "jair@example.com",
    cpf: "111.222.333-44",
    cellphone: "(51) 98765-4321",
    vehicles: [],
    role: "customer" as const,
    balance: 0,
  };

  it("should render loading state when query is loading", () => {
    const meSpy = spyOn(authService, "me").mockReturnValue(
      new Promise(() => {}),
    );
    spies.push(meSpy);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    renderEditProfile(queryClient);

    expect(screen.getByText("Carregando perfil...")).toBeInTheDocument();
  });

  it("should render error state when query fails", async () => {
    const meSpy = spyOn(authService, "me").mockRejectedValue(
      new Error("Failed to fetch"),
    );
    spies.push(meSpy);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    renderEditProfile(queryClient);

    await screen.findByText(
      "Não foi possível carregar as informações do perfil.",
    );
    expect(
      screen.getByText("Não foi possível carregar as informações do perfil."),
    ).toBeInTheDocument();
  });

  it("should pre-populate fields correctly", async () => {
    const meSpy = spyOn(authService, "me").mockResolvedValue(mockUser);
    spies.push(meSpy);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    renderEditProfile(queryClient);

    await screen.findByDisplayValue("Jair Messias");
    const nameInput = screen.getByLabelText(
      /Nome Completo/i,
    ) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/E-mail/i) as HTMLInputElement;
    const cpfInput = screen.getByLabelText(/CPF/i) as HTMLInputElement;
    const phoneInput = screen.getByLabelText(/Telefone/i) as HTMLInputElement;

    expect(nameInput.value).toBe("Jair Messias");
    expect(emailInput.value).toBe("jair@example.com");
    expect(cpfInput.value).toBe("111.222.333-44");
    expect(phoneInput.value).toBe("(51) 98765-4321");

    expect(cpfInput).toHaveAttribute("readonly");
    expect(cpfInput).toBeDisabled();
  });

  it("should navigate back to profile on Back button click", async () => {
    const meSpy = spyOn(authService, "me").mockResolvedValue(mockUser);
    spies.push(meSpy);
    const navigateMock = mock();
    const navigateSpy = spyOn(ReactRouter, "useNavigate").mockReturnValue(
      navigateMock,
    );
    spies.push(navigateSpy);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    renderEditProfile(queryClient);

    await screen.findByDisplayValue("Jair Messias");
    const backButton = screen.getByRole("button", { name: "Voltar" });
    fireEvent.click(backButton);

    expect(navigateMock).toHaveBeenCalledWith("/profile");
  });

  it("should show warning toast when no changes are made", async () => {
    const meSpy = spyOn(authService, "me").mockResolvedValue(mockUser);
    spies.push(meSpy);
    const toastWarningSpy = spyOn(toast, "warning").mockImplementation(
      () => "id",
    );
    spies.push(toastWarningSpy);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    renderEditProfile(queryClient);

    await screen.findByDisplayValue("Jair Messias");
    const saveButton = screen.getByRole("button", {
      name: "Salvar informações",
    });
    fireEvent.click(saveButton);

    expect(toastWarningSpy).toHaveBeenCalledWith(
      "Nenhuma alteração foi realizada.",
    );
  });

  it("should show error toast when email is invalid", async () => {
    const meSpy = spyOn(authService, "me").mockResolvedValue(mockUser);
    spies.push(meSpy);
    const toastErrorSpy = spyOn(toast, "error").mockImplementation(() => "id");
    spies.push(toastErrorSpy);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    renderEditProfile(queryClient);

    await screen.findByDisplayValue("Jair Messias");
    const emailInput = screen.getByLabelText(/E-mail/i);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });

    const saveButton = screen.getByRole("button", {
      name: "Salvar informações",
    });
    fireEvent.click(saveButton);

    expect(toastErrorSpy).toHaveBeenCalledWith(
      "Por favor, insira um e-mail válido.",
    );
  });

  it("should call mutate on submit with only modified fields", async () => {
    const meSpy = spyOn(authService, "me").mockResolvedValue(mockUser);
    spies.push(meSpy);
    const editSpy = spyOn(userService, "editUser").mockResolvedValue();
    spies.push(editSpy);
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    renderEditProfile(queryClient);

    await screen.findByDisplayValue("Jair Messias");
    const nameInput = screen.getByLabelText(/Nome Completo/i);
    fireEvent.change(nameInput, { target: { value: "Jair Bolsonaro" } });

    const saveButton = screen.getByRole("button", {
      name: "Salvar informações",
    });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(editSpy).toHaveBeenCalledWith("123", { name: "Jair Bolsonaro" });
    });
  });

  it("should show toast info on password reset link click", async () => {
    const meSpy = spyOn(authService, "me").mockResolvedValue(mockUser);
    spies.push(meSpy);
    const toastInfoSpy = spyOn(toast, "info").mockImplementation(() => "id");
    spies.push(toastInfoSpy);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    renderEditProfile(queryClient);

    await screen.findByDisplayValue("Jair Messias");
    const resetLink = screen.getByRole("button", { name: "Redefinir senha" });
    fireEvent.click(resetLink);

    expect(toastInfoSpy).toHaveBeenCalledWith(
      "A funcionalidade de redefinição de senha estará disponível em breve.",
    );
  });
});
