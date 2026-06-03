import { afterEach, describe, expect, it, mock } from "bun:test";
import {
  cleanup,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import type { AntennaDto } from "../dtos";

const mutateAsyncMock = mock();
let isPendingMock = false;

const mockUseUpdateAntenna = mock(() => ({
  mutateAsync: mutateAsyncMock,
  isPending: isPendingMock,
}));

mock.module("../hooks", () => ({
  useUpdateAntenna: mockUseUpdateAntenna,
}));

// Import after mocking the module
const { AdjustAntennaModal } = await import("./AdjustAntennaModal");

const mockAntenna: AntennaDto = {
  id: "antenna-001",
  name: "Antena 1",
  status: "On" as const,
  sensibility: -50,
  power: 28.0,
};

describe("AdjustAntennaModal component", () => {
  afterEach(() => {
    cleanup();
    mutateAsyncMock.mockReset();
    isPendingMock = false;
  });

  it("should render correctly when open", () => {
    render(
      <AdjustAntennaModal
        isOpen={true}
        onClose={mock()}
        antenna={mockAntenna}
      />,
    );
    expect(screen.getByText("Ajustar Antena")).toBeInTheDocument();
    expect(screen.getByLabelText("Status da antena")).toBeInTheDocument();
    expect(screen.getByLabelText("Sensibilidade (dBm)")).toBeInTheDocument();
    expect(screen.getByLabelText("Potência (dBm)")).toBeInTheDocument();
  });

  it("should not render when closed", () => {
    render(
      <AdjustAntennaModal
        isOpen={false}
        onClose={mock()}
        antenna={mockAntenna}
      />,
    );
    expect(screen.queryByText("Ajustar Antena")).toBeNull();
  });

  it("should fill fields with antenna data", () => {
    render(
      <AdjustAntennaModal
        isOpen={true}
        onClose={mock()}
        antenna={mockAntenna}
      />,
    );
    const statusCheckbox = screen.getByLabelText(
      "Status da antena",
    ) as HTMLInputElement;
    const sensibilityInput = screen.getByLabelText(
      "Sensibilidade (dBm)",
    ) as HTMLInputElement;
    const powerInput = screen.getByLabelText(
      "Potência (dBm)",
    ) as HTMLInputElement;

    expect(statusCheckbox.checked).toBe(true);
    expect(sensibilityInput.value).toBe("-50");
    expect(powerInput.value).toBe("28");
  });

  it("should default status to Off when missing or empty", () => {
    const incompleteAntenna = {
      id: "antenna-001",
      name: "Antena 1",
      sensibility: -50,
      power: 28.0,
    } as unknown as AntennaDto;

    render(
      <AdjustAntennaModal
        isOpen={true}
        onClose={mock()}
        antenna={incompleteAntenna}
      />,
    );
    const statusCheckbox = screen.getByLabelText(
      "Status da antena",
    ) as HTMLInputElement;
    expect(statusCheckbox.checked).toBe(false);
  });

  it("should default sensibility and power to empty when missing or null", () => {
    const incompleteAntenna = {
      id: "antenna-001",
      name: "Antena 1",
      status: "On",
      sensibility: null,
      power: null,
    } as unknown as AntennaDto;

    render(
      <AdjustAntennaModal
        isOpen={true}
        onClose={mock()}
        antenna={incompleteAntenna}
      />,
    );
    const sensibilityInput = screen.getByLabelText(
      "Sensibilidade (dBm)",
    ) as HTMLInputElement;
    const powerInput = screen.getByLabelText(
      "Potência (dBm)",
    ) as HTMLInputElement;

    expect(sensibilityInput.value).toBe("");
    expect(powerInput.value).toBe("");
  });

  it("should allow clearing numeric inputs", () => {
    render(
      <AdjustAntennaModal
        isOpen={true}
        onClose={mock()}
        antenna={mockAntenna}
      />,
    );
    const sensibilityInput = screen.getByLabelText(
      "Sensibilidade (dBm)",
    ) as HTMLInputElement;
    const powerInput = screen.getByLabelText(
      "Potência (dBm)",
    ) as HTMLInputElement;

    fireEvent.change(sensibilityInput, { target: { value: "" } });
    fireEvent.change(powerInput, { target: { value: "" } });

    expect(sensibilityInput.value).toBe("");
    expect(powerInput.value).toBe("");
  });

  it("should call mutateAsync with correct payload on submit", async () => {
    const onClose = mock();
    mutateAsyncMock.mockResolvedValueOnce({});
    render(
      <AdjustAntennaModal
        isOpen={true}
        onClose={onClose}
        antenna={mockAntenna}
      />,
    );

    const sensibilityInput = screen.getByLabelText(
      "Sensibilidade (dBm)",
    ) as HTMLInputElement;
    const powerInput = screen.getByLabelText(
      "Potência (dBm)",
    ) as HTMLInputElement;

    fireEvent.change(sensibilityInput, { target: { value: "-45" } });
    fireEvent.change(powerInput, { target: { value: "30.5" } });

    const submitBtn = screen.getByRole("button", { name: "Confirmar" });
    fireEvent.click(submitBtn);

    expect(mutateAsyncMock).toHaveBeenCalledWith({
      antennaId: "antenna-001",
      updateDto: {
        status: "On",
        sensibility: -45,
        power: 30.5,
      },
    });
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("should send null when inputs are empty", async () => {
    mutateAsyncMock.mockResolvedValueOnce({});
    render(
      <AdjustAntennaModal
        isOpen={true}
        onClose={mock()}
        antenna={mockAntenna}
      />,
    );

    const sensibilityInput = screen.getByLabelText(
      "Sensibilidade (dBm)",
    ) as HTMLInputElement;
    const powerInput = screen.getByLabelText(
      "Potência (dBm)",
    ) as HTMLInputElement;

    fireEvent.change(sensibilityInput, { target: { value: "" } });
    fireEvent.change(powerInput, { target: { value: "" } });

    const submitBtn = screen.getByRole("button", { name: "Confirmar" });
    fireEvent.click(submitBtn);

    expect(mutateAsyncMock).toHaveBeenCalledWith({
      antennaId: "antenna-001",
      updateDto: {
        status: "On",
        sensibility: null,
        power: null,
      },
    });
  });

  it("should call onClose when Cancelar is clicked", () => {
    const onClose = mock();
    render(
      <AdjustAntennaModal
        isOpen={true}
        onClose={onClose}
        antenna={mockAntenna}
      />,
    );
    const cancelBtn = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(cancelBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it("should show Confirmando... and disable button when pending", () => {
    isPendingMock = true;
    render(
      <AdjustAntennaModal
        isOpen={true}
        onClose={mock()}
        antenna={mockAntenna}
      />,
    );
    const confirmBtn = screen.getByRole("button", {
      name: "Confirmando...",
    }) as HTMLButtonElement;
    expect(confirmBtn).toBeInTheDocument();
    expect(confirmBtn.disabled).toBe(true);
  });

  it("should not submit and show toast error when sensibility is out of range", () => {
    render(
      <AdjustAntennaModal
        isOpen={true}
        onClose={mock()}
        antenna={mockAntenna}
      />,
    );
    const sensibilityInput = screen.getByLabelText(
      "Sensibilidade (dBm)",
    ) as HTMLInputElement;

    fireEvent.change(sensibilityInput, { target: { value: "-95" } }); // out of range
    const submitBtn = screen.getByRole("button", { name: "Confirmar" });
    fireEvent.click(submitBtn);

    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  it("should not submit and show toast error when power is out of range", () => {
    render(
      <AdjustAntennaModal
        isOpen={true}
        onClose={mock()}
        antenna={mockAntenna}
      />,
    );
    const powerInput = screen.getByLabelText(
      "Potência (dBm)",
    ) as HTMLInputElement;

    fireEvent.change(powerInput, { target: { value: "35" } }); // out of range
    const submitBtn = screen.getByRole("button", { name: "Confirmar" });
    fireEvent.click(submitBtn);

    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  it("should limit input length to 4 characters", () => {
    render(
      <AdjustAntennaModal
        isOpen={true}
        onClose={mock()}
        antenna={mockAntenna}
      />,
    );
    const sensibilityInput = screen.getByLabelText(
      "Sensibilidade (dBm)",
    ) as HTMLInputElement;

    fireEvent.change(sensibilityInput, { target: { value: "-1000" } }); // 5 characters
    expect(sensibilityInput.value).toBe("-50"); // should keep previous value since it was rejected by length check

    fireEvent.change(sensibilityInput, { target: { value: "-93" } }); // 3 characters
    expect(sensibilityInput.value).toBe("-93");
  });
});
