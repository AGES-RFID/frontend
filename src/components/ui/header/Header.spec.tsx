import { afterEach, describe, expect, it, mock } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import { Header } from ".";

function renderWithRouter(
  ui: React.ReactElement,
  { initialEntries = ["/"] } = {},
) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>,
  );
}

describe("Header component", () => {
  afterEach(cleanup);

  // ── type="logo" ─────────────────────────────────────────────────────────────

  describe("type='logo'", () => {
    it("should render the logo", () => {
      renderWithRouter(<Header type="logo" />);
      expect(screen.getByLabelText("Ir para Home")).toBeInTheDocument();
    });

    it("should not render nav buttons", () => {
      renderWithRouter(<Header type="logo" />);
      expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    });

    it("should trigger logo click without throwing", () => {
      renderWithRouter(<Header type="logo" />);
      expect(() => screen.getByLabelText("Ir para Home").click()).not.toThrow();
    });
  });

  // ── type="default" ──────────────────────────────────────────────────────────

  describe("type='default'", () => {
    it("should render the logo", () => {
      renderWithRouter(<Header />);
      expect(screen.getByLabelText("Ir para Home")).toBeInTheDocument();
    });

    it("should render nav buttons: Home, Pagamentos, Perfil", () => {
      renderWithRouter(<Header />);
      expect(screen.getByRole("button", { name: "Home" })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Pagamentos" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Perfil" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Admin" })).toBeInTheDocument();
    });

    it("should render 'Entrar/Cadastrar' when isLogged is false", () => {
      renderWithRouter(<Header isLogged={false} />);
      expect(
        screen.getByRole("button", { name: "Entrar/Cadastrar" }),
      ).toBeInTheDocument();
    });

    it("should render 'Sair' when isLogged is true", () => {
      renderWithRouter(<Header isLogged />);
      expect(screen.getByRole("button", { name: "Sair" })).toBeInTheDocument();
    });

    it("should call onAuthAction when auth button is clicked", () => {
      const handleAuth = mock();
      renderWithRouter(<Header onAuthAction={handleAuth} />);
      screen.getByRole("button", { name: "Entrar/Cadastrar" }).click();
      expect(handleAuth).toHaveBeenCalled();
    });

    it("should trigger logo click without throwing", () => {
      renderWithRouter(<Header />);
      expect(() => screen.getByLabelText("Ir para Home").click()).not.toThrow();
    });

    it("should trigger Home nav button click without throwing", () => {
      renderWithRouter(<Header />);
      expect(() =>
        screen.getByRole("button", { name: "Home" }).click(),
      ).not.toThrow();
    });

    it("should trigger Pagamentos nav button click without throwing", () => {
      renderWithRouter(<Header />);
      expect(() =>
        screen.getByRole("button", { name: "Pagamentos" }).click(),
      ).not.toThrow();
    });

    it("should trigger Perfil nav button click without throwing", () => {
      renderWithRouter(<Header />);
      expect(() =>
        screen.getByRole("button", { name: "Perfil" }).click(),
      ).not.toThrow();
    });

    it("should trigger Admin button click without throwing", () => {
      renderWithRouter(<Header />);
      expect(() =>
        screen.getByRole("button", { name: "Admin" }).click(),
      ).not.toThrow();
    });

    it("should update the active indicator on resize without throwing", () => {
      renderWithRouter(<Header />);
      expect(() => window.dispatchEvent(new Event("resize"))).not.toThrow();
    });
  });
});
