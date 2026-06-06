import { describe, it, expect, afterEach, mock } from "bun:test";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { EditCapacityModal } from "./EditCapacityModal";

afterEach(() => {
  cleanup();
});

describe("EditCapacityModal", () => {
  it("should not render anything when isOpen is false", () => {
    render(
      <EditCapacityModal isOpen={false} onClose={mock()} onConfirm={mock()} />,
    );
    expect(screen.queryByText("Editar lotação")).toBeNull();
  });

  it("should render correctly with the initial capacity", () => {
    render(
      <EditCapacityModal
        isOpen={true}
        onClose={mock()}
        onConfirm={mock()}
        currentCapacity={150}
      />,
    );

    expect(screen.getByText("Editar lotação")).toBeTruthy();
    expect(screen.getByText("Número de vagas")).toBeTruthy();

    const input = screen.getByLabelText("Número de vagas") as HTMLInputElement;
    expect(input.value).toBe("150");
  });

  it("should update the input value when the user types", () => {
    render(
      <EditCapacityModal
        isOpen={true}
        onClose={mock()}
        onConfirm={mock()}
        currentCapacity={100}
      />,
    );

    const input = screen.getByLabelText("Número de vagas") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "250" } });

    expect(input.value).toBe("250");
  });

  it("should call onClose when the Cancel button is clicked", () => {
    const onCloseMock = mock();
    render(
      <EditCapacityModal
        isOpen={true}
        onClose={onCloseMock}
        onConfirm={mock()}
      />,
    );

    const cancelButton = screen.getByText("Cancelar");
    fireEvent.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("should call onConfirm with the new capacity and close the modal when Confirm is clicked", () => {
    const onConfirmMock = mock();
    const onCloseMock = mock();

    render(
      <EditCapacityModal
        isOpen={true}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        currentCapacity={100}
      />,
    );

    const input = screen.getByLabelText("Número de vagas");
    fireEvent.change(input, { target: { value: "300" } });

    const confirmButton = screen.getByText("Confirmar");
    fireEvent.click(confirmButton);

    expect(onConfirmMock).toHaveBeenCalledWith(300);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("should not call onConfirm if the capacity is a negative number", () => {
    const onConfirmMock = mock();
    const onCloseMock = mock();

    render(
      <EditCapacityModal
        isOpen={true}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
      />,
    );

    const input = screen.getByLabelText("Número de vagas");

    fireEvent.change(input, { target: { value: "-50" } });

    const confirmButton = screen.getByText("Confirmar");
    fireEvent.click(confirmButton);

    expect(onConfirmMock).not.toHaveBeenCalled();
    expect(onCloseMock).not.toHaveBeenCalled();
  });
});
