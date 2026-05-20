import "@testing-library/jest-dom";
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
import { parkingPricesService } from "../ParkingPricesService";
import { EditValuesModal } from "./EditValuesModal";

const getPricingMock = spyOn(parkingPricesService, "getPricing");
const updateMock = spyOn(parkingPricesService, "updatePricing");

const pricingMock = {
  parkingPriceId: "pricing-id",
  toleranceMinutes: 15,
  basePrice: 15,
  thresholdMinutes: 180,
  hourlyRate: 5,
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("EditValuesModal", () => {
  beforeEach(() => {
    getPricingMock.mockResolvedValue(pricingMock);
    updateMock.mockResolvedValue(undefined);
  });

  afterEach(() => {
    cleanup();
    getPricingMock.mockClear();
    updateMock.mockClear();
  });

  it("renders correctly", () => {
    render(<EditValuesModal isOpen={true} onClose={() => {}} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText("Editar Valores")).toBeInTheDocument();

    expect(
      screen.getByLabelText("Tempo de Isenção (minutos)"),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Valor até 3 Horas (R$)")).toBeInTheDocument();

    expect(
      screen.getByLabelText("Valor da Hora Adicional (R$)"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Cancelar" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument();
  });

  it("fills inputs with pricing data from API", async () => {
    render(<EditValuesModal isOpen={true} onClose={() => {}} />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getByLabelText("Tempo de Isenção (minutos)")).toHaveValue(
        15,
      );
    });

    expect(screen.getByLabelText("Valor até 3 Horas (R$)")).toHaveValue(15);
    expect(screen.getByLabelText("Valor da Hora Adicional (R$)")).toHaveValue(
      5,
    );
  });

  it("updates input values and submits the form", async () => {
    const onCloseMock = mock(() => {});

    render(<EditValuesModal isOpen={true} onClose={onCloseMock} />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getByLabelText("Tempo de Isenção (minutos)")).toHaveValue(
        15,
      );
    });

    fireEvent.change(screen.getByLabelText("Tempo de Isenção (minutos)"), {
      target: { value: "20" },
    });

    fireEvent.change(screen.getByLabelText("Valor até 3 Horas (R$)"), {
      target: { value: "18.5" },
    });

    fireEvent.change(screen.getByLabelText("Valor da Hora Adicional (R$)"), {
      target: { value: "7.5" },
    });

    const form = screen.getByRole("button", { name: "Salvar" }).closest("form");

    expect(form).not.toBeNull();
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(updateMock).toHaveBeenCalledWith({
        toleranceMinutes: 20,
        basePrice: 18.5,
        hourlyRate: 7.5,
      });
    });

    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it("calls onClose when cancel button is clicked", () => {
    const onCloseMock = mock(() => {});

    render(<EditValuesModal isOpen={true} onClose={onCloseMock} />, {
      wrapper: createWrapper(),
    });

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(onCloseMock).toHaveBeenCalled();
  });

  it("shows saving state while update is pending", async () => {
    let resolveUpdate!: () => void;

    updateMock.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          resolveUpdate = resolve;
        }),
    );

    render(<EditValuesModal isOpen={true} onClose={() => {}} />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getByLabelText("Tempo de Isenção (minutos)")).toHaveValue(
        15,
      );
    });

    const form = screen.getByRole("button", { name: "Salvar" }).closest("form");
    expect(form).not.toBeNull();
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Salvando..." }),
      ).toBeDisabled();
    });

    resolveUpdate();
  });
});
