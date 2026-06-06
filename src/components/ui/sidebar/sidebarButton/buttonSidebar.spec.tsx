import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ButtonSidebar } from "./buttonSidebar";

describe("ButtonSidebar", () => {
  afterEach(cleanup);

  it("calls onClick when pressed", () => {
    let clickCount = 0;

    render(
      <ButtonSidebar
        label="DASHBOARD"
        icon={<span aria-hidden="true">icon</span>}
        isActive={false}
        onClick={() => {
          clickCount += 1;
        }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "DASHBOARD" }));
    expect(clickCount).toBe(1);
  });

  it("applies hover styles on mouse enter and removes them on mouse leave", () => {
    render(
      <ButtonSidebar
        label="VEÍCULOS"
        icon={<span aria-hidden="true">icon</span>}
        isActive={false}
        onClick={() => {}}
      />,
    );

    const button = screen.getByRole("button", { name: "VEÍCULOS" });

    fireEvent.mouseEnter(button);
    expect(button).toHaveClass("bg-white/10");

    fireEvent.mouseLeave(button);
    expect(button).toHaveClass("bg-transparent");
  });

  it("does not apply interactive z-index class to SAIR button", () => {
    render(
      <ButtonSidebar
        label="SAIR"
        icon={<span aria-hidden="true">icon</span>}
        isActive={false}
        onClick={() => {}}
      />,
    );

    const button = screen.getByRole("button", { name: "SAIR" });
    expect(button).not.toHaveClass("relative", "z-10");
  });
});
