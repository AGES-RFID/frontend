import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "bun:test";
import { HistoryCard } from "./HistoryCard";

afterEach(() => {
  cleanup();
});

describe("HistoryCard", () => {
  it("should render correctly for entry type", () => {
    render(
      <HistoryCard
        type="entry"
        date="06/05/2026"
        hour="14:30"
        tagId="ABC-1234"
      />,
    );

    expect(screen.getByText("06/05/2026 14:30")).toBeInTheDocument();
    expect(screen.getByText("Entrada")).toBeInTheDocument();

    const valueElement = screen.getByTestId("history-card-value");
    expect(valueElement).toHaveTextContent(/Entrada/);
    expect(valueElement).toHaveClass("text-teal");
  });

  it("should render correctly for exit type", () => {
    render(
      <HistoryCard
        type="exit"
        date="05/05/2026"
        hour="18:45"
        tagId="ABC-1234"
      />,
    );

    expect(screen.getByText("05/05/2026 18:45")).toBeInTheDocument();
    expect(screen.getByText("ABC-1234")).toBeInTheDocument();

    const valueElement = screen.getByTestId("history-card-value");
    expect(valueElement).toHaveTextContent(/Saída/);
    expect(valueElement).toHaveClass("text-red");
  });
});
