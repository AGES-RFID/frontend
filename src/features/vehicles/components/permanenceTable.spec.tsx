import { describe, it, expect, afterEach } from "bun:test";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { PermanenceTable } from "./permanenceTable";
import type { PermanenceDto } from "../dtos/permanenceDto";

afterEach(() => {
  cleanup();
});

const mockVehicles: (PermanenceDto & Record<string, unknown>)[] = [
  { rfidTag: "TAG-001", plate: "abcd1234", minutesParked: 120 },
  { rfidTag: "TAG-002", plate: "xyzw5678", minutesParked: 1440 },
  { rfidTag: "TAG-003", plate: "mnop9876", minutesParked: 30 },
  { rfidTag: "TAG-004", plate: "qwer4321", minutesParked: 2880 },
];

describe("PermanenceTable", () => {
  it("should render the table columns and correctly formatted data", () => {
    render(<PermanenceTable vehicles={mockVehicles.slice(0, 2)} />);

    expect(screen.getByText("Etiqueta RFID")).toBeTruthy();
    expect(screen.getByText("Placa")).toBeTruthy();
    expect(screen.getByText("Permanência")).toBeTruthy();

    expect(screen.getByText("ABCD-1234")).toBeTruthy();
    expect(screen.getByText("XYZW-5678")).toBeTruthy();

    expect(screen.getByText("2h")).toBeTruthy();
    expect(screen.getByText("1 dia")).toBeTruthy();
  });

  it("should sort vehicles in descending order by parked minutes", () => {
    render(<PermanenceTable vehicles={mockVehicles} />);

    const tags = screen.getAllByText(/TAG-/);

    expect(tags[0]?.textContent).toBe("TAG-004");
    expect(tags[1]?.textContent).toBe("TAG-002");
    expect(tags[2]?.textContent).toBe("TAG-001");
  });

  it("should paginate data restricting to 3 items per page", () => {
    render(<PermanenceTable vehicles={mockVehicles} />);

    expect(screen.getByText("TAG-004")).toBeTruthy();
    expect(screen.getByText("TAG-002")).toBeTruthy();
    expect(screen.getByText("TAG-001")).toBeTruthy();

    expect(screen.queryByText("TAG-003")).toBeNull();

    const nextButton = screen.getByText("›");
    fireEvent.click(nextButton);

    expect(screen.getByText("TAG-003")).toBeTruthy();
    expect(screen.queryByText("TAG-004")).toBeNull();
  });

  it("should disable previous buttons on the first page and next buttons on the last page", () => {
    render(<PermanenceTable vehicles={mockVehicles} />);

    const prevButtons = screen.getAllByText(/«|‹/);
    const nextButtons = screen.getAllByText(/»|›/);

    prevButtons.forEach((btn) => {
      expect((btn as HTMLButtonElement).disabled).toBe(true);
    });

    nextButtons.forEach((btn) => {
      expect((btn as HTMLButtonElement).disabled).toBe(false);
    });

    fireEvent.click(screen.getByText("›"));

    const updatedPrevButtons = screen.getAllByText(/«|‹/);
    const updatedNextButtons = screen.getAllByText(/»|›/);

    updatedPrevButtons.forEach((btn) => {
      expect((btn as HTMLButtonElement).disabled).toBe(false);
    });

    updatedNextButtons.forEach((btn) => {
      expect((btn as HTMLButtonElement).disabled).toBe(true);
    });
  });
});
