import { describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";

import { Graph } from ".";

describe("Graph", () => {
  it("should render graph title", () => {
    render(<Graph />);

    expect(screen.getByText(/fluxo de veículos por hora/i)).toBeTruthy();
  });
});
