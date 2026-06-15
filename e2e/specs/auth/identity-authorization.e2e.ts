import { test, expect } from "../../fixtures/base.fixture";

test.describe("Identity & Authorization - Controle de Sessão e Privilégios RBAC", () => {
  test("deve validar o fluxo de autenticação de administrador com acesso às rotas", async ({
    loginPage,
    sidebar,
    page,
  }) => {
    await loginPage.navigateTo();

    const loginResponse = page.waitForResponse(
      (response) =>
        response.url().includes("auth/login") && response.status() === 200,
    );

    await loginPage.performLogin("admin@email.com", "password");
    await loginResponse;

    await expect(sidebar.navigationContainer).toBeVisible({ timeout: 5000 });

    await expect(page).toHaveURL(/.*\/admin\/dashboard/);

    await expect(sidebar.dashboardLink).toBeVisible();
    await expect(sidebar.tagsLink).toBeVisible();
    await expect(sidebar.vehiclesLink).toBeVisible();
    await expect(sidebar.usersLink).toBeVisible();
    await expect(sidebar.paymentsLink).toBeVisible();
    await expect(sidebar.systemLink).toBeVisible();
  });

  test("deve impor barreiras de segurança para perfil cliente tentando acessar admin", async ({
    loginPage,
    page,
  }) => {
    await loginPage.navigateTo();

    const loginResponse = page.waitForResponse(
      (response) =>
        response.url().includes("auth/login") && response.status() === 200,
    );

    await loginPage.performLogin("cliente@email.com", "password");
    await loginResponse;

    await page.goto("/admin/dashboard");

    await expect(page).not.toHaveURL("**/admin/dashboard");
    await expect(page).toHaveURL("/");
  });
});
