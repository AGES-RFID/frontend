import { describe, expect, it, mock, afterEach } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";

import { HeaderAuthButton } from ".";

describe("HeaderAuthButton component", () => {
  afterEach(cleanup);

  it("should render 'Entrar/Cadastrar' by default", () => {
    render(<HeaderAuthButton />);
    expect(
      screen.getByRole("button", { name: "Entrar/Cadastrar" }),
    ).toBeInTheDocument();
  });

  it("should render 'Sair' when isLogged is true", () => {
    render(<HeaderAuthButton isLogged />);
    expect(screen.getByRole("button", { name: "Sair" })).toBeInTheDocument();
  });

  it("should trigger the action when clicked", () => {
    const handleAction = mock();

    render(<HeaderAuthButton action={handleAction} />);
    screen.getByRole("button").click();

    expect(handleAction).toHaveBeenCalled();
  });

  it("should not trigger the action if disabled", () => {
    const handleAction = mock();

    render(<HeaderAuthButton disabled action={handleAction} />);
    screen.getByRole("button").click();

    expect(handleAction).not.toHaveBeenCalled();
  });
});
