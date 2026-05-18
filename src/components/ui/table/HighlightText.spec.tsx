import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";

import { HighlightText } from "./HighlightText";

describe("HighlightText", () => {
  afterEach(cleanup);

  it("returns plain text when search term is empty", () => {
    const { container } = render(<HighlightText text="Alice" searchTerm="" />);

    expect(container).toHaveTextContent("Alice");
    expect(container.querySelector('[class*="bg-light-blue/50"]')).toBeNull();
  });

  it("highlights all case-insensitive matches", () => {
    render(<HighlightText text="Banana naNá" searchTerm="na" />);

    const highlights = document.querySelectorAll('[class*="bg-light-blue/50"]');
    expect(highlights.length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText("Ba")).toBeDefined();
  });

  it("renders only plain segments when there is no match", () => {
    const { container } = render(
      <HighlightText text="No matches here" searchTerm="xyz" />,
    );

    expect(container).toHaveTextContent("No matches here");
    expect(container.querySelector('[class*="bg-light-blue/50"]')).toBeNull();
  });
});
