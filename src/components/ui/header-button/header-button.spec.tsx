import { describe, expect, it, mock, afterEach } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";

import { HeaderButton } from ".";

const MockIcon = () => <svg data-testid="mock-icon" />;

describe("HeaderButton component", () => {
  afterEach(cleanup);

  it("should render the button with label", () => {
    render(<HeaderButton icon={<MockIcon />} label="Dashboard" />);
    expect(
      screen.getByRole("button", { name: "Dashboard" }),
    ).toBeInTheDocument();
  });

  it("should render the icon", () => {
    render(<HeaderButton icon={<MockIcon />} label="Dashboard" />);
    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
  });

  it("should have aria-pressed false when isActive is not set", () => {
    render(<HeaderButton icon={<MockIcon />} label="Dashboard" />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });

  it("should have aria-pressed true when isActive is true", () => {
    render(<HeaderButton icon={<MockIcon />} label="Dashboard" isActive />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("should trigger the action when clicked", () => {
    const handleAction = mock();

    render(
      <HeaderButton
        icon={<MockIcon />}
        label="Dashboard"
        action={handleAction}
      />,
    );
    screen.getByRole("button").click();

    expect(handleAction).toHaveBeenCalled();
  });

  it("should render without action without throwing", () => {
    expect(() =>
      render(<HeaderButton icon={<MockIcon />} label="Dashboard" />),
    ).not.toThrow();
  });
});
