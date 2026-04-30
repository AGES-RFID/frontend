import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { StatusBadge } from "./Status";

describe("StatusBadge component", () => {
  afterEach(cleanup);

  it("should render 'Livre' for AVAILABLE status", () => {
    render(<StatusBadge status="AVAILABLE" />);
    expect(screen.getByText("Livre")).toBeDefined();
  });

  it("should render 'Ativa' for IN_USE status", () => {
    render(<StatusBadge status="IN_USE" />);
    expect(screen.getByText("Ativa")).toBeDefined();
  });

  it("should render 'Inativa' for INACTIVE status", () => {
    render(<StatusBadge status="INACTIVE" />);
    expect(screen.getByText("Inativa")).toBeDefined();
  });
});
