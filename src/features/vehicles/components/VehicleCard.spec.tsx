import { afterEach, describe, expect, it, mock } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";

import { VehicleCard } from "./VehicleCard";

describe("VehicleCard component", () => {
  afterEach(cleanup);

  it("should render license plate", () => {
    render(<VehicleCard licensePlate="BRA2E91" />);

    expect(screen.getByRole("button", { name: /BRA2E91/ })).toBeInTheDocument();
  });

  it("should trigger onClick when clicking the card", () => {
    const handleClick = mock();

    render(<VehicleCard licensePlate="BRA2E91" onClick={handleClick} />);

    screen.getByRole("button", { name: /BRA2E91/ }).click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should trigger onDelete when clicking the trash icon", () => {
    const handleClick = mock();
    const handleDelete = mock();

    render(
      <VehicleCard
        licensePlate="BRA2E91"
        hasDelete
        onClick={handleClick}
        onDelete={handleDelete}
      />,
    );

    screen.getByRole("button", { name: /excluir veículo/i }).click();

    expect(handleDelete).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledTimes(0);
  });
});
