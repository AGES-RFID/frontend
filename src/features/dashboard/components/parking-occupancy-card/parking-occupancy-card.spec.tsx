import "@testing-library/jest-dom";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { ParkingOccupancyCard } from ".";

afterEach(() => {
  cleanup();
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("ParkingOccupancyCard", () => {
  test("should render the default title", () => {
    render(<ParkingOccupancyCard vehiclesCount={75} totalSpots={100} />);

    expect(screen.getByTestId("parking-occupancy-title").textContent).toBe(
      "Lotação do estacionamento",
    );
  });

  test("should render a custom title", () => {
    render(
      <ParkingOccupancyCard
        title="Ocupação atual"
        vehiclesCount={75}
        totalSpots={100}
      />,
    );

    expect(screen.getByTestId("parking-occupancy-title").textContent).toBe(
      "Ocupação atual",
    );
  });

  test("should render the label correctly", () => {
    render(<ParkingOccupancyCard vehiclesCount={75} totalSpots={100} />);

    expect(screen.getByTestId("parking-occupancy-label").textContent).toBe(
      "75/100",
    );
  });

  test("should render the correct progress width", () => {
    render(<ParkingOccupancyCard vehiclesCount={75} totalSpots={100} />);

    const progressBar = screen.getByTestId("parking-occupancy-progress-bar");
    expect(progressBar).toHaveStyle("width: 75%");
  });

  test("should cap progress width at 100% when vehicles exceed total spots", () => {
    render(<ParkingOccupancyCard vehiclesCount={120} totalSpots={100} />);

    expect(screen.getByTestId("parking-occupancy-label").textContent).toBe(
      "120/100",
    );

    const progressBar = screen.getByTestId("parking-occupancy-progress-bar");
    expect(progressBar).toHaveStyle("width: 100%");
  });

  test("should use the default color below 75%", () => {
    render(<ParkingOccupancyCard vehiclesCount={74} totalSpots={100} />);

    const progressBar = screen.getByTestId("parking-occupancy-progress-bar");
    expect(progressBar).toHaveStyle("background-color: #0C7C86");
  });

  test("should use the default color at exactly 75%", () => {
    render(<ParkingOccupancyCard vehiclesCount={75} totalSpots={100} />);

    const progressBar = screen.getByTestId("parking-occupancy-progress-bar");
    expect(progressBar).toHaveStyle("background-color: #0C7C86");
  });

  test("should use yellow above 75%", () => {
    render(<ParkingOccupancyCard vehiclesCount={76} totalSpots={100} />);

    const progressBar = screen.getByTestId("parking-occupancy-progress-bar");
    expect(progressBar).toHaveStyle("background-color: #facc15");
  });

  test("should use yellow at exactly 90%", () => {
    render(<ParkingOccupancyCard vehiclesCount={90} totalSpots={100} />);

    const progressBar = screen.getByTestId("parking-occupancy-progress-bar");
    expect(progressBar).toHaveStyle("background-color: #facc15");
  });

  test("should use red above 90%", () => {
    render(<ParkingOccupancyCard vehiclesCount={91} totalSpots={100} />);

    const progressBar = screen.getByTestId("parking-occupancy-progress-bar");
    expect(progressBar).toHaveStyle("background-color: #ef4444");
  });

  test("should render 0% width when total spots is 0", () => {
    render(<ParkingOccupancyCard vehiclesCount={10} totalSpots={0} />);

    const progressBar = screen.getByTestId("parking-occupancy-progress-bar");
    expect(progressBar).toHaveStyle("width: 0%");
  });

  test("should not show edit button when isEditable is false", () => {
    render(
      <ParkingOccupancyCard
        vehiclesCount={10}
        totalSpots={100}
        isEditable={false}
      />,
      { wrapper: createWrapper() },
    );
    expect(
      screen.queryByTestId("parking-occupancy-edit-button"),
    ).not.toBeInTheDocument();
  });

  test("should not show edit button when isEditable is not provided", () => {
    render(<ParkingOccupancyCard vehiclesCount={10} totalSpots={100} />, {
      wrapper: createWrapper(),
    });
    expect(
      screen.queryByTestId("parking-occupancy-edit-button"),
    ).not.toBeInTheDocument();
  });

  test("should show edit button when isEditable is true", () => {
    render(
      <ParkingOccupancyCard
        vehiclesCount={10}
        totalSpots={100}
        isEditable={true}
      />,
      { wrapper: createWrapper() },
    );
    expect(
      screen.getByTestId("parking-occupancy-edit-button"),
    ).toBeInTheDocument();
  });

  test("should open modal when edit button is clicked", () => {
    render(
      <ParkingOccupancyCard
        vehiclesCount={10}
        totalSpots={100}
        isEditable={true}
      />,
      { wrapper: createWrapper() },
    );
    fireEvent.click(screen.getByTestId("parking-occupancy-edit-button"));
    expect(screen.getByText("Editar Lotação Máxima")).toBeInTheDocument();
  });

  test("should close modal when cancel is clicked", () => {
    render(
      <ParkingOccupancyCard
        vehiclesCount={10}
        totalSpots={100}
        isEditable={true}
      />,
      { wrapper: createWrapper() },
    );
    fireEvent.click(screen.getByTestId("parking-occupancy-edit-button"));
    expect(screen.getByText("Editar Lotação Máxima")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(screen.queryByText("Editar Lotação Máxima")).not.toBeInTheDocument();
  });

  test("should apply drop-shadow-lg class", () => {
    render(<ParkingOccupancyCard vehiclesCount={10} totalSpots={100} />, {
      wrapper: createWrapper(),
    });
    const card = screen.getByTestId("parking-occupancy-card");
    expect(card.className).toContain("drop-shadow-lg");
  });
});
