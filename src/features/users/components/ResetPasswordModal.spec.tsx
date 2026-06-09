/** biome-ignore-all lint/style/noNonNullAssertion: Needed for array destructuring */
import "@testing-library/jest-dom";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { ResetPasswordModal } from "./ResetPasswordModal";

const onClose = mock();
const onSubmit = mock();

function renderModal(isOpen = true, isSubmitting = false) {
  return render(
    <ResetPasswordModal
      isOpen={isOpen}
      onClose={onClose}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
    />,
  );
}

describe("ResetPasswordModal", () => {
  beforeEach(() => {
    onClose.mockClear();
    onSubmit.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it("should not render when isOpen is false", () => {
    renderModal(false);
    expect(screen.queryByText("Redefinir Senha")).not.toBeInTheDocument();
  });

  it("should render all three password fields when open", () => {
    renderModal();
    expect(screen.getByText("Senha atual")).toBeInTheDocument();
    expect(screen.getByText("Nova senha")).toBeInTheDocument();
    expect(screen.getByText("Confirmar nova senha")).toBeInTheDocument();
  });

  it("should render Cancelar and Confirmar buttons", () => {
    renderModal();
    expect(
      screen.getByRole("button", { name: "Cancelar" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Confirmar" }),
    ).toBeInTheDocument();
  });

  it("should call onClose when Cancelar is clicked", () => {
    renderModal();
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should show 'Confirmando...' on Confirmar button while submitting", () => {
    renderModal(true, true);
    expect(
      screen.getByRole("button", { name: "Confirmando..." }),
    ).toBeInTheDocument();
  });

  it("should show validation error when passwords do not match", () => {
    renderModal();

    const [currentPasswordInput, newPasswordInput, confirmPasswordInput] =
      screen.getAllByPlaceholderText(/senha/i);

    fireEvent.change(currentPasswordInput!, { target: { value: "senha123" } });
    fireEvent.change(newPasswordInput!, { target: { value: "novaSenha1" } });
    fireEvent.change(confirmPasswordInput!, {
      target: { value: "novaSenhaDiferente" },
    });

    fireEvent.submit(
      screen.getByRole("button", { name: "Confirmar" }).closest("form")!,
    );

    expect(screen.getByText("As senhas não coincidem.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should call onSubmit with correct values when passwords match", () => {
    renderModal();

    const [currentPasswordInput, newPasswordInput, confirmPasswordInput] =
      screen.getAllByPlaceholderText(/senha/i);

    fireEvent.change(currentPasswordInput!, {
      target: { value: "senhaAtual123" },
    });
    fireEvent.change(newPasswordInput!, { target: { value: "novaSenha123" } });
    fireEvent.change(confirmPasswordInput!, {
      target: { value: "novaSenha123" },
    });

    fireEvent.submit(
      screen.getByRole("button", { name: "Confirmar" }).closest("form")!,
    );

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      currentPassword: "senhaAtual123",
      password: "novaSenha123",
      confirmPassword: "novaSenha123",
    });
  });

  it("should clear validation error when user starts typing after mismatch", () => {
    renderModal();

    const [currentPasswordInput, newPasswordInput, confirmPasswordInput] =
      screen.getAllByPlaceholderText(/senha/i);

    fireEvent.change(currentPasswordInput!, { target: { value: "senha123" } });
    fireEvent.change(newPasswordInput!, { target: { value: "novaSenha1" } });
    fireEvent.change(confirmPasswordInput!, {
      target: { value: "diferente" },
    });

    fireEvent.submit(
      screen.getByRole("button", { name: "Confirmar" }).closest("form")!,
    );
    expect(screen.getByText("As senhas não coincidem.")).toBeInTheDocument();

    // Typing clears the error
    fireEvent.change(newPasswordInput!, { target: { value: "novaSenha123" } });
    expect(
      screen.queryByText("As senhas não coincidem."),
    ).not.toBeInTheDocument();
  });

  it("should reset form data when modal is reopened", () => {
    const { rerender } = renderModal(false);

    rerender(
      <ResetPasswordModal
        isOpen={true}
        onClose={onClose}
        isSubmitting={false}
        onSubmit={onSubmit}
      />,
    );

    const inputs = screen.getAllByPlaceholderText(/senha/i);
    for (const input of inputs) {
      expect((input as HTMLInputElement).value).toBe("");
    }
  });
});
