import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, mock } from "bun:test";
import { BalanceCard } from ".";
import { formatCurrency } from "../../../utils/formatting";

afterEach(() => {
  cleanup();
});

describe("BalanceCard", () => {
  it("should render without crashing", () => {
    const { container } = render(
      <BalanceCard balance={0} onAddBalance={() => {}} />,
    );
    expect(container).toBeDefined();
  });

  it("should display the label 'Seu saldo:'", () => {
    render(<BalanceCard balance={100} onAddBalance={() => {}} />);
    expect(screen.getByText("Seu saldo:")).toBeDefined();
  });

  it("should display the balance formatted as BRL currency", () => {
    render(<BalanceCard balance={1500} onAddBalance={() => {}} />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toBe(formatCurrency(1500));
  });

  it("should format a decimal balance correctly", () => {
    render(<BalanceCard balance={99.9} onAddBalance={() => {}} />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toBe(formatCurrency(99.9));
  });

  it("should format a zero balance correctly", () => {
    render(<BalanceCard balance={0} onAddBalance={() => {}} />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toBe(formatCurrency(0));
  });

  it("should render the 'Adicionar saldo' button", () => {
    render(<BalanceCard balance={50} onAddBalance={() => {}} />);
    expect(
      screen.getByRole("button", { name: "Adicionar saldo" }),
    ).toBeDefined();
  });

  it("should call onAddBalance when the button is clicked", () => {
    const onAddBalance = mock();
    render(<BalanceCard balance={50} onAddBalance={onAddBalance} />);
    const button = screen.getByRole("button", { name: "Adicionar saldo" });
    button.click();
    expect(onAddBalance).toHaveBeenCalledTimes(1);
  });

  it("should apply additional className passed via props", () => {
    const { container } = render(
      <BalanceCard
        balance={200}
        onAddBalance={() => {}}
        className="custom-class"
      />,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
