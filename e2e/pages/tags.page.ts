import type { Locator, Page } from "@playwright/test";

export class TagsPage {
  private readonly page: Page;
  readonly confirmDeactivationButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.confirmDeactivationButton = page.getByRole("button", {
      name: /confirmar/i,
    });
  }

  async navigateTo(): Promise<void> {
    await this.page.goto("/admin/tags");
  }

  /**
   * Desativa uma tag dinamicamente buscando pela linha exata (robusto contra paginação e ordenação)
   */
  async deactivateTagByEpc(epc: string): Promise<void> {
    const targetRow = this.page.getByRole("row", { name: epc });
    const deactivateButton = targetRow.getByRole("button", {
      name: /desativar/i,
    });

    await deactivateButton.click();
    await this.confirmDeactivationButton.click();
  }
}
