import "@testing-library/jest-dom";
import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { accessesService } from "@/features/accesses/AccessesService";
import { antennaService } from "@/features/antennas/AntennaService";
import { dashboardService } from "@/features/dashboard/DashboardService";
import { Dashboard } from "./dashboard";

const getMetricsMock = spyOn(dashboardService, "getMetrics");
const getOccupancyMock = spyOn(dashboardService, "getOccupancy");
const getTimeseriesMock = spyOn(accessesService, "getTimeseries");
const getAccessesMock = spyOn(accessesService, "getAccesses");
const getAntennasMock = spyOn(antennaService, "getAntennas");

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
    getOccupancyMock.mockResolvedValue({
      currentOccupancy: 2,
      maxOccupancy: 100,
      occupancyPercentage: 2,
      vehicles: [],
    });
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
    getAccessesMock.mockResolvedValue([
      {
        accessId: "access-1",
        tagId: "TAG-001",
        type: "entry",
        timestamp: new Date(Date.now() - 120 * 60_000).toISOString(),
        plate: "ABCD1234",
        value: null,
      },
      {
        accessId: "access-2",
        tagId: "TAG-002",
        type: "exit",
        timestamp: new Date(Date.now() - 60 * 60_000).toISOString(),
        plate: "WXYZ9876",
        value: 20,
      },
    ]);
    getAntennasMock.mockResolvedValue([
      {
        id: "antenna-1",
        name: "Antena 1",
        status: "On",
        sensibility: -50,
        power: 28,
      },
    ]);
  });

  afterEach(() => {
    cleanup();
    getMetricsMock.mockClear();
    getOccupancyMock.mockClear();
    getTimeseriesMock.mockClear();
    getAccessesMock.mockClear();
    getAntennasMock.mockClear();
  });

  it("should render Dashboard page title", () => {
    render(<Dashboard />, { wrapper: createWrapper() });
    expect(screen.getByText("Monitoramento em tempo real")).toBeInTheDocument();
  });

  it("should render entries metric card", () => {
    render(<Dashboard />, { wrapper: createWrapper() });

    expect(screen.getByText("Entradas (Última Hora)")).toBeInTheDocument();
  });

  it("should render exits metric card", () => {
    render(<Dashboard />, { wrapper: createWrapper() });

    expect(screen.getByText("Saídas (Última Hora)")).toBeInTheDocument();
  });

  it("should render parking occupancy component with backend data", async () => {
    render(<Dashboard />, { wrapper: createWrapper() });

    expect(await screen.findByText("Lotação do estacionamento")).toBeTruthy();
    expect(await screen.findByText("2/100")).toBeTruthy();
  });

  it("should render graph legend with timeseries data", async () => {
    render(<Dashboard />, { wrapper: createWrapper() });

    expect(await screen.findByText("Entradas")).toBeInTheDocument();
    expect(await screen.findByText("Saídas")).toBeInTheDocument();
  });

  it("should render antennas with backend data", async () => {
    render(<Dashboard />, { wrapper: createWrapper() });

    expect(await screen.findByText("Antenas")).toBeInTheDocument();
    expect(await screen.findByText("Antena 1")).toBeInTheDocument();
  });

  it("should render permanence table from latest entry accesses", async () => {
    render(<Dashboard />, { wrapper: createWrapper() });

    expect(await screen.findByText("Etiqueta RFID")).toBeInTheDocument();
    expect(await screen.findByText("TAG-001")).toBeInTheDocument();
    expect(screen.queryByText("TAG-002")).not.toBeInTheDocument();
  });
});
