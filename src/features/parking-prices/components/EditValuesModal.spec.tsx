import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { describe, expect, it, afterEach, spyOn } from "bun:test";
import { EditValuesModal } from "./EditValuesModal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { parkingPricesService } from "../ParkingPricesService";

const updateMock = spyOn(parkingPricesService, "updatePricing");
spyOn(parkingPricesService, "getPricing").mockResolvedValue({
  parkingPriceId: "pricing-id",
  toleranceMinutes: 15,
  basePrice: 15,
  thresholdMinutes: 180,
  hourlyRate: 5,
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("EditValuesModal", () => {
  afterEach(() => {
    cleanup();
    updateMock.mockClear();
  });

  it("renders correctly", () => {
    render(<EditValuesModal isOpen={true} onClose={() => {}} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByText("Editar Valores")).toBeDefined();
  });

  it("handles submit", async () => {
    updateMock.mockResolvedValueOnce(undefined);
    const { getByText } = render(
      <EditValuesModal isOpen={true} onClose={() => {}} />,
      { wrapper: createWrapper() },
    );
    fireEvent.submit(getByText("Salvar").closest("form")!);
    await waitFor(() => expect(updateMock).toHaveBeenCalled());
  });
});
