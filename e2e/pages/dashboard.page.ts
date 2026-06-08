import type { Locator, Page } from "@playwright/test";

export class DashboardPage {
  private readonly page: Page;
  readonly availableVagasCounter: Locator;
  readonly recentExitsTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.availableVagasCounter = page.getByTestId("parking-occupancy-label");

    this.recentExitsTable = page.getByTestId("recent-exits-table");
  }

  async navigateTo(): Promise<void> {
    await this.page.goto("/admin/dashboard");
  }
}
