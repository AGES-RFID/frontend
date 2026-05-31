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

  it("should render entries metric card", () => {
    render(<Dashboard />, { wrapper: createWrapper() });

    expect(screen.getByText("Entradas (Última Hora)")).toBeInTheDocument();
  });

  it("should render exits metric card", () => {
    render(<Dashboard />, { wrapper: createWrapper() });

    expect(screen.getByText("Saídas (Última Hora)")).toBeInTheDocument();
  });

  it("should display metrics from API when loaded", async () => {
    render(<Dashboard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });
});
