import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import type { ReactNode } from "react";
import { antennaService } from "../AntennaService";
import type { AntennaDto } from "../dtos";
import { AdjustAntennaModal } from "./AdjustAntennaModal";

const updateAntennaSpy = spyOn(antennaService, "updateAntenna");

const mockAntenna: AntennaDto = {
  id: "antenna-001",
  name: "Antena 1",
  status: "On",
  sensibility: -50,
  power: 28.0,
};

describe("AdjustAntennaModal component", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
        queries: { retry: false },
      },
    });
    updateAntennaSpy.mockClear();
    updateAntennaSpy.mockResolvedValue(mockAntenna);
  });

  afterEach(() => {
    cleanup();
    queryClient.clear();
  });

  const renderWithClient = (ui: ReactNode) =>
    render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    );

  it("should render correctly when open", () => {
    renderWithClient(
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
    renderWithClient(
      <AdjustAntennaModal
        isOpen={false}
        onClose={mock()}
        antenna={mockAntenna}
      />,
    );

    expect(screen.queryByText("Ajustar Antena")).toBeNull();
  });

  it("should fill fields with antenna data", () => {
    renderWithClient(
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

    renderWithClient(
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

    renderWithClient(
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
    renderWithClient(
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

    renderWithClient(
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
    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));

    await waitFor(() =>
      expect(updateAntennaSpy).toHaveBeenCalledWith("antenna-001", {
        status: "On",
        sensibility: -45,
        power: 30.5,
      }),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("should send null when inputs are empty", async () => {
    renderWithClient(
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
    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));

    await waitFor(() =>
      expect(updateAntennaSpy).toHaveBeenCalledWith("antenna-001", {
        status: "On",
        sensibility: null,
        power: null,
      }),
    );
  });

  it("should call onClose when Cancelar is clicked", () => {
    const onClose = mock();

    renderWithClient(
      <AdjustAntennaModal
        isOpen={true}
        onClose={onClose}
        antenna={mockAntenna}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("should show Confirmando... and disable button while submitting", async () => {
    updateAntennaSpy.mockImplementationOnce(
      () => new Promise<AntennaDto>(() => {}),
    );

    renderWithClient(
      <AdjustAntennaModal
        isOpen={true}
        onClose={mock()}
        antenna={mockAntenna}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));

    const confirmBtn = (await screen.findByRole("button", {
      name: "Confirmando...",
    })) as HTMLButtonElement;
    expect(confirmBtn).toBeInTheDocument();
    expect(confirmBtn.disabled).toBe(true);
  });

  it("should not submit and show toast error when sensibility is out of range", () => {
    renderWithClient(
      <AdjustAntennaModal
        isOpen={true}
        onClose={mock()}
        antenna={mockAntenna}
      />,
    );

    const sensibilityInput = screen.getByLabelText(
      "Sensibilidade (dBm)",
    ) as HTMLInputElement;

    fireEvent.change(sensibilityInput, { target: { value: "-95" } });
    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(updateAntennaSpy).not.toHaveBeenCalled();
  });

  it("should not submit and show toast error when power is out of range", () => {
    renderWithClient(
      <AdjustAntennaModal
        isOpen={true}
        onClose={mock()}
        antenna={mockAntenna}
      />,
    );

    const powerInput = screen.getByLabelText(
      "Potência (dBm)",
    ) as HTMLInputElement;

    fireEvent.change(powerInput, { target: { value: "35" } });
    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(updateAntennaSpy).not.toHaveBeenCalled();
  });

  it("should limit input length to 4 characters", () => {
    renderWithClient(
      <AdjustAntennaModal
        isOpen={true}
        onClose={mock()}
        antenna={mockAntenna}
      />,
    );

    const sensibilityInput = screen.getByLabelText(
      "Sensibilidade (dBm)",
    ) as HTMLInputElement;

    fireEvent.change(sensibilityInput, { target: { value: "-1000" } });
    expect(sensibilityInput.value).toBe("-50");

    fireEvent.change(sensibilityInput, { target: { value: "-93" } });
    expect(sensibilityInput.value).toBe("-93");
  });
});
