import "@testing-library/jest-dom";
import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import { parkingPricesService } from "../../parking-prices/ParkingPricesService";
import { PricingTable } from "./PricingTable";

const getPricingSpy = spyOn(parkingPricesService, "getPricing");

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("PricingTable", () => {
  beforeEach(() => {
    getPricingSpy.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render skeleton when isLoading is true", () => {
    getPricingSpy.mockImplementation(() => new Promise(() => {})); // returns a pending promise so isLoading is true
    const { container } = render(<PricingTable />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText("Tempo")).toBeInTheDocument();
    expect(container.querySelectorAll(".animate-pulse")).toHaveLength(10);
  });

  it("should render pricing data correctly", async () => {
    getPricingSpy.mockResolvedValueOnce({
      parkingPriceId: "pricing-id",
      toleranceMinutes: 15,
      basePrice: 10,
      thresholdMinutes: 180,
      hourlyRate: 5,
    });
    render(<PricingTable />, { wrapper: createWrapper() });

    expect(await screen.findByText("Até 15 minutos")).toBeInTheDocument();
    expect(await screen.findByText("Até 3 horas")).toBeInTheDocument();
    expect(await screen.findByText("Hora adicional")).toBeInTheDocument();

    expect(await screen.findByText("Isento")).toBeInTheDocument();
    expect(await screen.findByText("R$ 10,00")).toBeInTheDocument();
    expect(await screen.findByText("R$ 5,00")).toBeInTheDocument();
  });

  it("should render error state if isError is true", async () => {
    getPricingSpy.mockRejectedValueOnce(new Error("Failed"));
    render(<PricingTable />, { wrapper: createWrapper() });
    expect(
      await screen.findByText("Erro ao carregar tabela de preços."),
    ).toBeInTheDocument();
  });

  it("should apply additional className to the container", async () => {
    getPricingSpy.mockResolvedValueOnce({
      parkingPriceId: "pricing-id",
      toleranceMinutes: 15,
      basePrice: 10,
      thresholdMinutes: 180,
      hourlyRate: 5,
    });
    const { container } = render(<PricingTable className="custom-class" />, {
      wrapper: createWrapper(),
    });

    // Wait for the skeleton to disappear and the real table to render
    await screen.findByText("Tempo");
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
