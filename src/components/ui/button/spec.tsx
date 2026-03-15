import { describe, expect, it, mock } from "bun:test";
import { render, screen } from "@testing-library/react";

import { Button } from ".";

describe("Button component", () => {
  it("should render the button", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });

  it("should trigger the click event", () => {
    const handleClick = mock();

    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole("button");
    button.click();

    expect(handleClick).toHaveBeenCalled();
  });

  it("should not trigger the click event if the button is disabled", () => {
    const handleClick = mock();

    render(
      <Button disabled onClick={handleClick}>
        Click me
      </Button>,
    );
    const button = screen.getByRole("button");
    button.click();

    expect(handleClick).not.toHaveBeenCalled();
  });
});
