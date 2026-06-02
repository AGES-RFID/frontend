import "@testing-library/jest-dom";
import { afterEach, describe, expect, test, mock } from "bun:test";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { ParkingOccupancyCard } from ".";

afterEach(() => {
  cleanup();
});

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

  test("should open edit modal and call onEditCapacity when isEditable is true", () => {
    const onEditCapacityMock = mock();

    render(
      <ParkingOccupancyCard
        vehiclesCount={10}
        totalSpots={100}
        isEditable={true}
        onEditCapacity={onEditCapacityMock}
      />,
    );

    const editButton = screen.getByTestId("edit-capacity-button");
    fireEvent.click(editButton);

    expect(screen.getByText("Editar lotação")).toBeTruthy();

    const input = screen.getByLabelText("Número de vagas");
    fireEvent.change(input, { target: { value: "200" } });

    const confirmButton = screen.getByText("Confirmar");
    fireEvent.click(confirmButton);

    expect(onEditCapacityMock).toHaveBeenCalledWith(200);
  });

  test("should not render the edit button when isEditable is false", () => {
    render(<ParkingOccupancyCard vehiclesCount={10} totalSpots={100} />);

    const editButton = screen.queryByTestId("edit-capacity-button");
    expect(editButton).toBeNull();
  });
});
