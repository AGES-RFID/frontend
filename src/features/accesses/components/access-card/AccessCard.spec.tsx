import "@testing-library/jest-dom";
import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { AccessCard } from "./AccessCard";

afterEach(() => {
  cleanup();
});

describe("AccessCard", () => {
  it("should render correctly for entry type", () => {
    render(
      <AccessCard
        type="entry"
        date="06/05/2026"
        hour="14:30"
        tagId="ABC-1234"
      />,
    );

    expect(screen.getByText("06/05/2026 14:30")).toBeInTheDocument();
    expect(screen.getByText("Entrada")).toBeInTheDocument();

    const valueElement = screen.getByTestId("access-card-value");
    expect(valueElement).toHaveTextContent(/Entrada/);
    expect(valueElement).toHaveClass("text-teal");
  });

  it("should render correctly for exit type", () => {
    render(
      <AccessCard
        type="exit"
        date="05/05/2026"
        hour="18:45"
        tagId="ABC-1234"
      />,
    );

    expect(screen.getByText("05/05/2026 18:45")).toBeInTheDocument();
    expect(screen.getByText("ABC-1234")).toBeInTheDocument();

    const valueElement = screen.getByTestId("access-card-value");
    expect(valueElement).toHaveTextContent(/Saída/);
    expect(valueElement).toHaveClass("text-red");
  });

  it("should render correctly for deposit type", () => {
    render(
      <AccessCard
        type="deposit"
        date="12/03/2026"
        hour="09:33am"
        amount={4.5}
      />,
    );

    expect(screen.getByText("12/03/2026 09:33am")).toBeInTheDocument();
    expect(screen.getByText("Crédito")).toBeInTheDocument();

    const valueElement = screen.getByTestId("access-card-value");
    expect(valueElement).toHaveTextContent(/\+R\$ 4,50/);
    expect(valueElement).toHaveClass("text-teal");
  });

  it("should render correctly for withdrawal type", () => {
    render(
      <AccessCard
        type="withdrawal"
        date="12/03/2026"
        hour="09:33am"
        amount={4.5}
        tagId="BRA2E91"
      />,
    );

    expect(screen.getByText("12/03/2026 09:33am")).toBeInTheDocument();
    expect(screen.getByText("BRA2E91")).toBeInTheDocument();

    const valueElement = screen.getByTestId("access-card-value");
    expect(valueElement).toHaveTextContent(/-R\$ 4,50/);
    expect(valueElement).toHaveClass("text-red");
  });
});
