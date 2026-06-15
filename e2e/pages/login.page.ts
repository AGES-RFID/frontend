import { expect, type Locator, type Page } from "@playwright/test";

export class LoginPage {
  private readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly enterButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder("Digite seu email");
    this.passwordInput = page.getByPlaceholder("Digite sua senha");
    this.enterButton = page.getByRole("button", { name: /^entrar$/i });
  }

  async navigateTo(): Promise<void> {
    await this.page.goto("/login");

    await this.emailInput.waitFor({
      state: "visible",
      timeout: 10000,
    });
  }

  async performLogin(email: string, pass: string): Promise<void> {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();

    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);

    await expect(this.enterButton).toBeEnabled();
    await this.enterButton.click();
  }
}
