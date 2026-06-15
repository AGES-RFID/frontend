import type { Locator, Page } from "@playwright/test";

export class SidebarComponent {
  readonly navigationContainer: Locator;
  readonly dashboardLink: Locator;
  readonly tagsLink: Locator;
  readonly vehiclesLink: Locator;
  readonly usersLink: Locator;
  readonly paymentsLink: Locator;
  readonly systemLink: Locator;

  constructor(page: Page) {
    this.navigationContainer = page.locator("nav");

    this.dashboardLink = page.getByRole("button", { name: /^dashboard$/i });
    this.tagsLink = page.getByRole("button", { name: /^etiquetas$/i });
    this.vehiclesLink = page.getByRole("button", { name: /^veículos$/i });
    this.usersLink = page.getByRole("button", { name: /^usuários$/i });
    this.paymentsLink = page.getByRole("button", { name: /^cobrança$/i });
    this.systemLink = page.getByRole("button", { name: /^sistema$/i });
  }
}
