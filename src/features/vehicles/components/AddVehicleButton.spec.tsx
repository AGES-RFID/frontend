import { afterEach, describe, expect, it, mock } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";

import { AddVehicleCard } from "./AddVehicleButton";

describe("AddVehicleCard component", () => {
  afterEach(cleanup);

  it("should render the add vehicle card", () => {
    render(<AddVehicleCard />);

    expect(screen.getByRole("button")).toHaveTextContent("Adicionar veículo");
  });

  it("should trigger the click event", () => {
    const handleClick = mock();

    render(<AddVehicleCard onClick={handleClick} />);

    const button = screen.getByRole("button");
    button.click();

    expect(handleClick).toHaveBeenCalled();
  });

  it("should render the small version", () => {
    render(<AddVehicleCard size="sm" />);

    expect(screen.getByRole("button")).toHaveTextContent("Adicionar veículo");
  });
});
