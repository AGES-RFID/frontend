import "@testing-library/jest-dom";
import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Dashboard } from "./dashboard";
import { dashboardService } from "@/features/dashboard/DashboardService";

const getMetricsMock = spyOn(dashboardService, "getMetrics");

const mockMetrics = {
  entriesLastHour: 5,
  exitsLastHour: 2,
  peakEntryTime: "10:00",
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
  });

  afterEach(() => {
    cleanup();
    getMetricsMock.mockClear();
  });

  it("should render Dashboard page title", () => {
    render(<Dashboard />, { wrapper: createWrapper() });
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(
      screen.getByText("Bem-vindo ao painel principal do sistema IMPINJ"),
    ).toBeInTheDocument();
  });

  it("should render MetricCard with top label 'Horário com mais entradas'", () => {
    render(<Dashboard />, { wrapper: createWrapper() });
    expect(screen.getByText("Horário com mais entradas")).toBeInTheDocument();
  });

  it("should display peak entry time from API metrics when loaded", async () => {
    render(<Dashboard />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByText("10:00")).toBeInTheDocument();
    });
  });

  it("should render fallback text when peakEntryTime is null", async () => {
    getMetricsMock.mockResolvedValue({
      entriesLastHour: 0,
      exitsLastHour: 0,
      peakEntryTime: null,
    });

    render(<Dashboard />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByText("--:--")).toBeInTheDocument();
    });
  });
});
