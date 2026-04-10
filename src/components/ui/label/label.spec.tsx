import { describe, expect, it, afterEach } from "bun:test";
import { render, screen, cleanup } from "@testing-library/react";

import { Label } from ".";

describe("Label component", () => {
  afterEach(cleanup);

  it("should render the label text", () => {
    render(<Label label="Label" value="value" />);
    expect(screen.getByText("Label")).toBeDefined();
  });

  it("should render the value text", () => {
    render(<Label label="Label" value="value" />);
    expect(screen.getByText("value")).toBeDefined();
  });

  it("should render with custom label and value", () => {
    render(<Label label="Nome" value="João Silva" />);
    expect(screen.getByText("Nome")).toBeDefined();
    expect(screen.getByText("João Silva")).toBeDefined();
  });
});
