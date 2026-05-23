import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import * as ReactRouter from "react-router";
import { MemoryRouter } from "react-router";
import { authService } from "@/features/auth/AuthService";
import { Profile } from "./profile";

function renderProfile(queryClient: QueryClient) {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/profile"]}>
        <Profile />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("Profile Component", () => {
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

    renderProfile(queryClient);

    expect(screen.getByText("Carregando perfil...")).toBeInTheDocument();
  });

  it("should render error state when query fails", async () => {
    const meSpy = spyOn(authService, "me").mockRejectedValue(
      new Error("Failed to fetch"),
    );
    spies.push(meSpy);
    const navigateMock = mock();
    const navigateSpy = spyOn(ReactRouter, "useNavigate").mockReturnValue(
      navigateMock,
    );
    spies.push(navigateSpy);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    renderProfile(queryClient);

    await screen.findByText(
      "Não foi possível carregar as informações do perfil.",
    );
    expect(
      screen.getByText("Não foi possível carregar as informações do perfil."),
    ).toBeInTheDocument();

    const homeButton = screen.getByRole("button", { name: "Voltar para Home" });
    fireEvent.click(homeButton);

    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  it("should render user profile details correctly when loaded", async () => {
    const meSpy = spyOn(authService, "me").mockResolvedValue(mockUser);
    spies.push(meSpy);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    renderProfile(queryClient);

    await screen.findByText("Jair Messias");
    expect(screen.getByText("Meu Perfil")).toBeInTheDocument();
    expect(screen.getByText("jair@example.com")).toBeInTheDocument();
    expect(screen.getByText("111.222.333-44")).toBeInTheDocument();
    expect(screen.getByText("(51) 98765-4321")).toBeInTheDocument();
  });

  it("should navigate to edit profile page on button click", async () => {
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

    renderProfile(queryClient);

    await screen.findByText("Jair Messias");
    const button = screen.getByRole("button", { name: "Editar informações" });
    fireEvent.click(button);

    expect(navigateMock).toHaveBeenCalledWith("/profile/edit");
  });
});
