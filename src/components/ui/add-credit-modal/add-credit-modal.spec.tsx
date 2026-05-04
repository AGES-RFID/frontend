import "@testing-library/jest-dom";
import { afterEach, describe, expect, mock, test } from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";

import { AddCreditModal } from ".";

type AddCreditModalProps = ComponentProps<typeof AddCreditModal>;

function renderAddCreditModal(props?: Partial<AddCreditModalProps>) {
  const onClose = mock(() => {});
  const onConfirm = mock(() => {});

  render(
    <AddCreditModal
      clientBalance={10.5}
      isOpen
      onClose={onClose}
      onConfirm={onConfirm}
      {...props}
    />,
  );

  return {
    onClose,
    onConfirm,
  };
}

afterEach(() => {
  cleanup();
});

describe("AddCreditModal", () => {
  test("should not render when isOpen is false", () => {
    renderAddCreditModal({ isOpen: false });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("should render the client balance received by props", () => {
    renderAddCreditModal();

    expect(screen.getByTestId("client-balance")).toHaveTextContent("R$ 10,50");
  });

  test("should start with an empty input and disabled confirm button", () => {
    renderAddCreditModal();

    expect(screen.getByLabelText("Adicionar valor")).toHaveValue("");
    expect(screen.getByRole("button", { name: "Confirmar" })).toBeDisabled();
  });

  test("should format typed numbers from right to left", () => {
    renderAddCreditModal();

    const input = screen.getByLabelText("Adicionar valor");

    fireEvent.change(input, { target: { value: "1" } });
    expect(input).toHaveValue("R$ 0,01");

    fireEvent.change(input, { target: { value: "12" } });
    expect(input).toHaveValue("R$ 0,12");

    fireEvent.change(input, { target: { value: "123" } });
    expect(input).toHaveValue("R$ 1,23");

    fireEvent.change(input, { target: { value: "1000" } });
    expect(input).toHaveValue("R$ 10,00");
  });

  test("should ignore non numeric characters", () => {
    renderAddCreditModal();

    const input = screen.getByLabelText("Adicionar valor");

    fireEvent.change(input, { target: { value: "abc1d2" } });

    expect(input).toHaveValue("R$ 0,12");
  });

  test("should clear the input and disable confirm button when value is removed", () => {
    renderAddCreditModal();

    const input = screen.getByLabelText("Adicionar valor");
    const confirmButton = screen.getByRole("button", { name: "Confirmar" });

    fireEvent.change(input, { target: { value: "1000" } });

    expect(input).toHaveValue("R$ 10,00");
    expect(confirmButton).toBeEnabled();

    fireEvent.change(input, { target: { value: "" } });

    expect(input).toHaveValue("");
    expect(confirmButton).toBeDisabled();
  });

  test("should add suggested values to the current input value instead of replacing it", () => {
    renderAddCreditModal();

    const input = screen.getByLabelText("Adicionar valor");

    fireEvent.change(input, { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: "+ R$ 5,00" }));

    expect(input).toHaveValue("R$ 5,01");
  });

  test("should add suggested value when input is empty", () => {
    renderAddCreditModal();

    const input = screen.getByLabelText("Adicionar valor");

    fireEvent.click(screen.getByRole("button", { name: "+ R$ 10,00" }));

    expect(input).toHaveValue("R$ 10,00");
  });

  test("should call onConfirm with the input value", () => {
    const { onConfirm } = renderAddCreditModal();

    fireEvent.change(screen.getByLabelText("Adicionar valor"), {
      target: { value: "1000" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(onConfirm).toHaveBeenCalledWith(10);
  });

  test("should call onClose when cancel button is clicked", () => {
    const { onClose } = renderAddCreditModal();

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(onClose).toHaveBeenCalled();
  });

  test("should reset typed value when modal is reopened", () => {
    const onClose = mock(() => {});
    const onConfirm = mock(() => {});

    const { rerender } = render(
      <AddCreditModal
        clientBalance={10.5}
        isOpen
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );

    const input = screen.getByLabelText("Adicionar valor");

    fireEvent.change(input, { target: { value: "1000" } });
    expect(input).toHaveValue("R$ 10,00");

    rerender(
      <AddCreditModal
        clientBalance={10.5}
        isOpen={false}
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );

    rerender(
      <AddCreditModal
        clientBalance={10.5}
        isOpen
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );

    expect(screen.getByLabelText("Adicionar valor")).toHaveValue("");
  });
});
