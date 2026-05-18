import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test";
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
import { transactionService } from "@/features/transactions/TransactionService";
import { Payments } from "./payments";

const getTransactionsMock = spyOn(transactionService, "getTransactions");
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
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("Payments", () => {
  beforeEach(() => {
    getTransactionsMock.mockResolvedValue([]);
    getPricingMock.mockResolvedValue(pricingMock);
  });

  afterEach(() => {
    cleanup();
    getTransactionsMock.mockClear();
    getPricingMock.mockClear();
  });

  it("should render the payments page", async () => {
    render(<Payments />, { wrapper: createWrapper() });

    expect(screen.getByText("Cobrança")).toBeDefined();
    expect(screen.getByText("Valores do estacionamento")).toBeDefined();
    expect(screen.getByText("Editar Valores")).toBeDefined();

    expect(await screen.findByText("Até 15 minutos")).toBeDefined();
    expect(await screen.findByText("Até 3 horas")).toBeDefined();
    expect(await screen.findByText("Hora adicional")).toBeDefined();

    expect(screen.getByText("Saídas recentes")).toBeDefined();
  });

  it("should open the edit values modal when clicking the button", async () => {
    render(<Payments />, { wrapper: createWrapper() });

    fireEvent.click(screen.getByRole("button", { name: "Editar Valores" }));

    await waitFor(() => {
      expect(screen.getByText("Editar valores")).toBeDefined();
      expect(screen.getByText("Modal de edição")).toBeDefined();
    });
  });

  it("should close the edit values modal when clicking the backdrop", async () => {
    render(<Payments />, { wrapper: createWrapper() });

    fireEvent.click(screen.getByRole("button", { name: "Editar Valores" }));

    await waitFor(() => {
      expect(screen.getByText("Modal de edição")).toBeDefined();
    });

    fireEvent.click(screen.getByLabelText("Fechar modal"));

    await waitFor(() => {
      expect(screen.queryByText("Modal de edição")).toBeNull();
    });
  });
});
