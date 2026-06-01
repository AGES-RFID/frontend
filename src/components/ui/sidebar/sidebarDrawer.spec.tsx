import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router";

const { SidebarDrawer } = await import("./sidebarDrawer");

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
}

function renderSidebar(initialEntry = "/admin/dashboard") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <SidebarDrawer />
      <LocationDisplay />
    </MemoryRouter>,
  );
}

describe("SidebarDrawer", () => {
  afterEach(cleanup);

  it("maps route prefixes to the correct active index", () => {
    const routeToIndex: Array<[string, number]> = [
      ["/admin", 0],
      ["/admin/vehicles", 1],
      ["/admin/users", 2],
      ["/admin/tags", 3],
      ["/admin/payments", 4],
      ["/admin/system", 5],
      ["/unknown", 0],
    ];

    for (const [route, expectedIndex] of routeToIndex) {
      const { container, unmount } = renderSidebar(route);
      const indicator = container.querySelector('nav div[aria-hidden="true"]');

      expect(indicator).toBeInTheDocument();
      expect(indicator?.getAttribute("style")).toContain(
        `translateY(${expectedIndex * 72}px)`,
      );

      unmount();
    }
  });

  it("navigates to each admin route when menu buttons are clicked", () => {
    renderSidebar("/admin");

    const cases: Array<[string, string]> = [
      ["DASHBOARD", "/admin/dashboard"],
      ["VEÍCULOS", "/admin/vehicles"],
      ["USUÁRIOS", "/admin/users"],
      ["ETIQUETAS", "/admin/tags"],
      ["COBRANÇA", "/admin/payments"],
      ["SISTEMA", "/admin/system"],
    ];

    for (const [label, expectedPath] of cases) {
      fireEvent.click(screen.getByRole("button", { name: label }));
      expect(screen.getByTestId("location-display")).toHaveTextContent(
        expectedPath,
      );
    }
  });

  it("navigates to dashboard from logo and to login from logout button", () => {
    renderSidebar("/admin/system");

    const btn = screen.getAllByRole("button", { name: "Logo Impinj" })[0];
    if (btn) {
      fireEvent.click(btn);
    }

    expect(screen.getByTestId("location-display")).toHaveTextContent(
      "/admin/dashboard",
    );

    fireEvent.click(screen.getByRole("button", { name: "SAIR" }));
    expect(screen.getByTestId("location-display")).toHaveTextContent("/login");
  });
});
