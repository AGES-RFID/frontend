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
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { parkingPricesService } from "@/features/parking-prices/ParkingPricesService";

const useGetTransactionsMock = mock(() => ({
  data: [],
  isLoading: false,
}));

mock.module("@/features/transactions/hooks/useGetTransactions", () => ({
  useGetTransactions: useGetTransactionsMock,
}));

const { Payments } = await import("./payments");

const getPricingMock = spyOn(parkingPricesService, "getPricing");

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
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("Payments", () => {
  beforeEach(() => {
    useGetTransactionsMock.mockReturnValue({
      data: [],
      isLoading: false,
    });

    getPricingMock.mockResolvedValue(pricingMock);
  });

  afterEach(() => {
    cleanup();
    useGetTransactionsMock.mockClear();
    getPricingMock.mockClear();
  });

  it("should render the payments page", async () => {
    render(<Payments />, { wrapper: createWrapper() });

    expect(screen.getByText("Cobrança")).toBeInTheDocument();
    expect(screen.getByText("Valores do estacionamento")).toBeInTheDocument();

    // Target the button specifically
    expect(
      screen.getByRole("button", { name: "Editar Valores" }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Até 15 minutos")).toBeInTheDocument();
      expect(screen.getByText("Até 3 horas")).toBeInTheDocument();
      expect(screen.getByText("Hora adicional")).toBeInTheDocument();
    });

    expect(screen.getByText("Saídas recentes")).toBeInTheDocument();
    expect(useGetTransactionsMock).toHaveBeenCalled();
  });

  it("should open the edit values modal when clicking the button", async () => {
    render(<Payments />, { wrapper: createWrapper() });

    fireEvent.click(screen.getByRole("button", { name: "Editar Valores" }));

    await waitFor(() => {
      // Use getByLabelText which is unique to the modal
      expect(
        screen.getByLabelText("Tempo de Isenção (minutos)"),
      ).toBeInTheDocument();
    });
  });

  it("should close the edit values modal when clicking the cancel button", async () => {
    render(<Payments />, { wrapper: createWrapper() });

    fireEvent.click(screen.getByRole("button", { name: "Editar Valores" }));

    await waitFor(() => {
      expect(
        screen.getByLabelText("Tempo de Isenção (minutos)"),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    await waitFor(() => {
      expect(screen.queryByLabelText("Tempo de Isenção (minutos)")).toBeNull();
    });
  });
});
