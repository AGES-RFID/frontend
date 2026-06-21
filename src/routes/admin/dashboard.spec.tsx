import "@testing-library/jest-dom";
import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { dashboardService } from "@/features/dashboard/DashboardService";
import { Dashboard } from "./dashboard";
import { accessesService } from "@/features/accesses/AccessesService";

const getMetricsMock = spyOn(dashboardService, "getMetrics");
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
    getMetricsMock.mockResolvedValue(mockMetrics);
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
    getMetricsMock.mockClear();
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
});
