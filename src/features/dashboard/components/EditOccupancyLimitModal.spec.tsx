import "@testing-library/jest-dom";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";

import { EditOccupancyLimitModal } from "./EditOccupancyLimitModal";
import { dashboardService } from "../DashboardService";

const updateMock = spyOn(dashboardService, "updateOccupancyLimit");

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

describe("EditOccupancyLimitModal", () => {
  beforeEach(() => {
    updateMock.mockResolvedValue(undefined);
  });

  afterEach(() => {
    cleanup();
    updateMock.mockClear();
  });

  it("renders with the title and pre-populated value", () => {
    render(
      <EditOccupancyLimitModal
        isOpen={true}
        onClose={() => {}}
        currentMaxOccupancy={120}
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.getByText("Editar Lotação Máxima")).toBeInTheDocument();
    expect(screen.getByLabelText("Lotação máxima")).toHaveValue(120);
    expect(
      screen.getByRole("button", { name: "Cancelar" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(
      <EditOccupancyLimitModal
        isOpen={false}
        onClose={() => {}}
        currentMaxOccupancy={100}
      />,
      { wrapper: createWrapper() },
    );

    expect(screen.queryByText("Editar Lotação Máxima")).not.toBeInTheDocument();
  });

  it("calls onClose when cancel is clicked", () => {
    const onCloseMock = mock(() => {});

    render(
      <EditOccupancyLimitModal
        isOpen={true}
        onClose={onCloseMock}
        currentMaxOccupancy={100}
      />,
      { wrapper: createWrapper() },
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(onCloseMock).toHaveBeenCalled();
  });

  it("submits the updated value and closes on success", async () => {
    const onCloseMock = mock(() => {});

    render(
      <EditOccupancyLimitModal
        isOpen={true}
        onClose={onCloseMock}
        currentMaxOccupancy={100}
      />,
      { wrapper: createWrapper() },
    );

    fireEvent.change(screen.getByLabelText("Lotação máxima"), {
      target: { value: "200" },
    });

    const form = screen.getByRole("button", { name: "Salvar" }).closest("form");
    expect(form).not.toBeNull();
    if (form) fireEvent.submit(form);

    await waitFor(() => {
      expect(updateMock).toHaveBeenCalledWith({ maxOccupancy: 200 });
    });

    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it("shows Salvando... and disables button while pending", async () => {
    let resolveUpdate!: () => void;
    updateMock.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          resolveUpdate = resolve;
        }),
    );

    render(
      <EditOccupancyLimitModal
        isOpen={true}
        onClose={() => {}}
        currentMaxOccupancy={100}
      />,
      { wrapper: createWrapper() },
    );

    const form = screen.getByRole("button", { name: "Salvar" }).closest("form");
    expect(form).not.toBeNull();
    if (form) fireEvent.submit(form);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Salvando..." }),
      ).toBeDisabled();
    });

    resolveUpdate();
  });

  it("resets to updated currentMaxOccupancy when reopened", () => {
    const { rerender } = render(
      <EditOccupancyLimitModal
        isOpen={false}
        onClose={() => {}}
        currentMaxOccupancy={100}
      />,
      { wrapper: createWrapper() },
    );

    rerender(
      <EditOccupancyLimitModal
        isOpen={true}
        onClose={() => {}}
        currentMaxOccupancy={200}
      />,
    );

    expect(screen.getByLabelText("Lotação máxima")).toHaveValue(200);
  });
});
