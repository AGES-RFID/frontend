import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { ShieldIcon } from "lucide-react";
import { SystemHealthCard } from "./SystemHealthCard";

describe("SystemHealthCard", () => {
  afterEach(cleanup);

  it("should render the default title", () => {
    render(<SystemHealthCard />);
    expect(screen.getByText("Saúde do sistema")).toBeDefined();
  });

  it("should render a custom title", () => {
    render(<SystemHealthCard title="Health Overview" />);
    expect(screen.getByText("Health Overview")).toBeDefined();
  });

  it("should render all default item labels", () => {
    render(<SystemHealthCard />);

    expect(screen.getByText("RFID Cloud Connection")).toBeDefined();
    expect(screen.getByText("Gate Controllers")).toBeDefined();
    expect(screen.getByText("Gate Management")).toBeDefined();
    expect(screen.getByText("System Status")).toBeDefined();
  });

  it("should render custom items when provided", () => {
    render(
      <SystemHealthCard
        items={[
          {
            id: "custom-1",
            label: "Custom Service",
            icon: ShieldIcon,
            iconBg: "bg-blue",
            iconColor: "text-blue",
            status: "warning",
          },
        ]}
      />,
    );

    expect(screen.getByText("Custom Service")).toBeDefined();
  });
});
