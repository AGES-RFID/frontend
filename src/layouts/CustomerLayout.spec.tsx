import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import * as ReactRouter from "react-router";
import { MemoryRouter } from "react-router";
import { CustomerLayout } from "./CustomerLayout";

describe("CustomerLayout Component", () => {
  const navigateMock = mock();
  let navigateSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    navigateSpy = spyOn(ReactRouter, "useNavigate").mockReturnValue(
      navigateMock,
    );
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    navigateMock.mockReset();
    navigateSpy.mockRestore();
  });

  it("should render the header and outlet wrapper", () => {
    render(
      <MemoryRouter>
        <CustomerLayout />
      </MemoryRouter>,
    );

    // Header has the logo image
    expect(screen.getByAltText("Impinj")).toBeInTheDocument();
    // Default action button when not logged in is "Entrar/Cadastrar"
    expect(
      screen.getByRole("button", { name: "Entrar/Cadastrar" }),
    ).toBeInTheDocument();
  });

  it("should detect logged in state from token and show Sair button", () => {
    localStorage.setItem("rfid-auth-token", "some-valid-token");

    render(
      <MemoryRouter>
        <CustomerLayout />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: "Sair" })).toBeInTheDocument();
  });

  it("should navigate to login when auth action is clicked and not logged in", () => {
    render(
      <MemoryRouter>
        <CustomerLayout />
      </MemoryRouter>,
    );

    const authButton = screen.getByRole("button", { name: "Entrar/Cadastrar" });
    fireEvent.click(authButton);

    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  it("should clear token and navigate to login when auth action is clicked and logged in", () => {
    localStorage.setItem("rfid-auth-token", "some-valid-token");

    render(
      <MemoryRouter>
        <CustomerLayout />
      </MemoryRouter>,
    );

    const authButton = screen.getByRole("button", { name: "Sair" });
    fireEvent.click(authButton);

    expect(localStorage.getItem("rfid-auth-token")).toBeNull();
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });
});
