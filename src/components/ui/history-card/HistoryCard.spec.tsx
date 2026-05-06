import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "bun:test";
import { HistoryCard } from "./HistoryCard";

afterEach(() => {
  cleanup();
});

describe("HistoryCard", () => {
  it("should render correctly for credit type", () => {
    render(
      <HistoryCard type="credit" value={150} date="06/05/2026" hour="14:30" />,
    );

    expect(screen.getByText("06/05/2026 14:30")).toBeInTheDocument();
    expect(screen.getByText("Crédito")).toBeInTheDocument();

    const valueElement = screen.getByTestId("history-card-value");
    expect(valueElement).toHaveTextContent(/\+/);
    expect(valueElement).toHaveTextContent(/150/);
    expect(valueElement).toHaveClass("text-teal");
  });

  it("should render correctly for exit type", () => {
    render(
      <HistoryCard
        type="exit"
        value={15}
        date="05/05/2026"
        hour="18:45"
        licensePlate="ABC-1234"
      />,
    );

    expect(screen.getByText("05/05/2026 18:45")).toBeInTheDocument();
    expect(screen.getByText("ABC-1234")).toBeInTheDocument();

    const valueElement = screen.getByTestId("history-card-value");
    expect(valueElement).toHaveTextContent(/-/);
    expect(valueElement).toHaveTextContent(/15/);
    expect(valueElement).toHaveClass("text-red");
  });
});
