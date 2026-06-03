import { afterEach, describe, expect, it, mock } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { AntennaCard } from ".";

describe("AntennaCard component", () => {
  afterEach(cleanup);

  const defaultProps = {
    name: "Antena 1",
    status: "On" as const,
    sensitivity: -50,
    power: 28.0,
  };

  it("should render the antenna details correctly", () => {
    render(<AntennaCard {...defaultProps} />);

    expect(screen.getByText("Antena 1")).toBeInTheDocument();
    expect(screen.getByText("Status:")).toBeInTheDocument();
    expect(screen.getByText("On")).toBeInTheDocument();
    expect(screen.getByText("Sensitivity:")).toBeInTheDocument();
    expect(screen.getByText("-50 dBm")).toBeInTheDocument();
    expect(screen.getByText("Power:")).toBeInTheDocument();
    expect(screen.getByText("28.0 dBm")).toBeInTheDocument();
  });

  it("should format raw sensitivity and power values correctly", () => {
    render(<AntennaCard {...defaultProps} sensitivity={-45} power={30} />);

    expect(screen.getByText("-45 dBm")).toBeInTheDocument();
    expect(screen.getByText("30.0 dBm")).toBeInTheDocument();
  });

  it("should not double-format already formatted strings", () => {
    render(
      <AntennaCard {...defaultProps} sensitivity="-45 dBm" power="30.0 dBm" />,
    );

    expect(screen.getByText("-45 dBm")).toBeInTheDocument();
    expect(screen.getByText("30.0 dBm")).toBeInTheDocument();
  });

  it("should not show the edit button if editable is false", () => {
    render(<AntennaCard {...defaultProps} editable={false} />);

    // There shouldn't be any button on the card when not editable
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("should show the edit button and trigger onEdit if editable is true", () => {
    const handleEdit = mock();
    render(
      <AntennaCard {...defaultProps} editable={true} onEdit={handleEdit} />,
    );

    const editBtn = screen.getByRole("button", { name: /editar antena 1/i });
    expect(editBtn).toBeInTheDocument();

    editBtn.click();
    expect(handleEdit).toHaveBeenCalled();
  });

  it("should use custom labels if provided", () => {
    const customLabels = {
      status: "Estado:",
      sensitivity: "Sensibilidade:",
      power: "Potência:",
    };

    render(<AntennaCard {...defaultProps} labels={customLabels} />);

    expect(screen.getByText("Estado:")).toBeInTheDocument();
    expect(screen.getByText("Sensibilidade:")).toBeInTheDocument();
    expect(screen.getByText("Potência:")).toBeInTheDocument();
  });

  it("should apply correct status styles for 'On' state", () => {
    const { container } = render(<AntennaCard {...defaultProps} status="On" />);

    // Check if the ping and glowing elements have the correct green classes
    const pingGlow = container.querySelector(".animate-ping");
    expect(pingGlow?.className).toContain("bg-green");

    const indicator = container.querySelector(
      ".relative.inline-flex.rounded-full",
    );
    expect(indicator?.className).toContain("bg-green");
    expect(indicator?.className).toContain("shadow-glow-green");
  });

  it("should apply correct status styles for 'Off' state", () => {
    const { container } = render(
      <AntennaCard {...defaultProps} status="Off" />,
    );

    // Check if the ping and glowing elements have the correct red classes
    const pingGlow = container.querySelector(".animate-ping");
    expect(pingGlow?.className).toContain("bg-red");

    const indicator = container.querySelector(
      ".relative.inline-flex.rounded-full",
    );
    expect(indicator?.className).toContain("bg-red");
    expect(indicator?.className).toContain("shadow-glow-red");
  });
});
