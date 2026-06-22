import "@testing-library/jest-dom";
import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { dashboardService } from "@/features/dashboard/DashboardService";
import { Dashboard } from "./dashboard";
import { accessesService } from "@/features/accesses/AccessesService";

const getDashboardMock = spyOn(dashboardService, "getDashboard");
const getTimeseriesMock = spyOn(accessesService, "getTimeseries");

const mockMetrics = {
  entriesLastHour: 5,
  exitsLastHour: 2,
  peakEntryTime: "10:00",
  peakHourEntries: 5,
  currentOccupancy: 2,
  maxOccupancy: 100,
  accesses: [],
  updatedAt: "2026-06-20T20:00:00Z",
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("Dashboard Route Component", () => {
  beforeEach(() => {
    getDashboardMock.mockResolvedValue(mockMetrics);
    getTimeseriesMock.mockResolvedValue({
      from: "2026-06-13T10:00:00Z",
      to: "2026-06-14T10:00:00Z",
      series: [
        {
          key: "entries",
          points: [{ timestamp: "2026-06-13T10:00:00Z", count: 20 }],
        },
        {
          key: "exits",
          points: [{ timestamp: "2026-06-13T10:00:00Z", count: 15 }],
        },
      ],
    });
  });

  afterEach(() => {
    cleanup();
    getDashboardMock.mockClear();
    getTimeseriesMock.mockClear();
  });

  it("should render Dashboard page title", () => {
    render(<Dashboard />, { wrapper: createWrapper() });
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(
      screen.getByText("Bem-vindo ao painel principal do sistema IMPINJ"),
    ).toBeInTheDocument();
  });

  it("should render entries metric card", () => {
    render(<Dashboard />, { wrapper: createWrapper() });
    expect(screen.getByText("Entradas (Última Hora)")).toBeInTheDocument();
  });

  it("should render exits metric card", () => {
    render(<Dashboard />, { wrapper: createWrapper() });
    expect(screen.getByText("Saídas (Última Hora)")).toBeInTheDocument();
  });

  it("should render graph legend with timeseries data", async () => {
    render(<Dashboard />, { wrapper: createWrapper() });
    expect(await screen.findByText("Entradas")).toBeInTheDocument();
    expect(await screen.findByText("Saídas")).toBeInTheDocument();
  });

  it("should render peak entry time metric card with value from metrics", async () => {
    render(<Dashboard />, { wrapper: createWrapper() });
    expect(screen.getByText("Horário com mais entradas")).toBeInTheDocument();
    expect(
      await screen.findByText((content: string) => content.includes("10:00")),
    ).toBeInTheDocument();
  });

  it("should render parking occupancy card with metrics values", async () => {
    render(<Dashboard />, { wrapper: createWrapper() });
    expect(screen.getByText("Lotação do estacionamento")).toBeInTheDocument();
    const occupancyLabel = await screen.findByTestId("parking-occupancy-label");
    expect(occupancyLabel.textContent).toContain("2");
    expect(occupancyLabel.textContent).toContain("100");
  });

  it("should render antenna cards with names and statuses", () => {
    render(<Dashboard />, { wrapper: createWrapper() });
    expect(screen.getByText("Antena 1 (entrada)")).toBeInTheDocument();
    expect(screen.getByText("Antena 2 (saída)")).toBeInTheDocument();
    const indicators = screen.getAllByTestId("status-indicator");
    expect(indicators).toHaveLength(2);
  });

  it("should open antenna adjustment modal when edit button is clicked", () => {
    render(<Dashboard />, { wrapper: createWrapper() });

    expect(
      screen.getByRole("button", { name: /Editar Antena 1/ }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Editar Antena 1/ }));

    expect(screen.getByText("Ajustar Antena")).toBeInTheDocument();
    expect(screen.getByLabelText("Status da antena")).toBeInTheDocument();
  });

  it("should render fallback values when metrics are null", () => {
    getDashboardMock.mockResolvedValue({
      entriesLastHour: null as unknown as number,
      exitsLastHour: null as unknown as number,
      peakEntryTime: null as unknown as string,
      peakHourEntries: null as unknown as number,
      currentOccupancy: null as unknown as number,
      maxOccupancy: null as unknown as number,
      accesses: [],
      updatedAt: "2026-06-20T20:00:00Z",
    });

    render(<Dashboard />, { wrapper: createWrapper() });
    expect(screen.getByText("Entradas (Última Hora)")).toBeInTheDocument();
    expect(screen.getAllByText("0")).toHaveLength(2);
    expect(screen.getByText("--:--")).toBeInTheDocument();
  });

  it("should render no graph legend when timeseries is empty", async () => {
    getTimeseriesMock.mockResolvedValue({
      from: "2026-06-13T10:00:00Z",
      to: "2026-06-14T10:00:00Z",
      series: [],
    });

    render(<Dashboard />, { wrapper: createWrapper() });
    expect(screen.queryByText("Entradas")).not.toBeInTheDocument();
    expect(screen.queryByText("Saídas")).not.toBeInTheDocument();
  });
});
