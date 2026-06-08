// frontend/e2e/components/sidebar.component.ts
import type { Locator, Page } from "@playwright/test";

export class SidebarComponent {
  readonly navigationContainer: Locator;
  readonly dashboardLink: Locator;
  readonly tagsLink: Locator;
  readonly vehiclesLink: Locator;
  readonly usersLink: Locator;
  readonly paymentsLink: Locator; // Adicionado para cobertura total
  readonly systemLink: Locator;   // Adicionado para cobertura total

  constructor(page: Page) {
    // Captura o elemento nav estrutural
    this.navigationContainer = page.locator("nav");

    // CORREÇÃO: Papel alterado para "button" e strings adaptadas com acentuação estrita do código real
    this.dashboardLink = page.getByRole("button", { name: /^dashboard$/i });
    this.tagsLink = page.getByRole("button", { name: /^etiquetas$/i });
    this.vehiclesLink = page.getByRole("button", { name: /^veículos$/i }); 
    this.usersLink = page.getByRole("button", { name: /^usuários$/i });   
    this.paymentsLink = page.getByRole("button", { name: /^cobrança$/i }); 
    this.systemLink = page.getByRole("button", { name: /^sistema$/i });     
  }
}
