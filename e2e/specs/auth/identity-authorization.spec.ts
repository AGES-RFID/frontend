// frontend/e2e/specs/auth/identity-authorization.spec.ts
import { test, expect } from "../../fixtures/base.fixture";

test.describe("Identity & Authorization - Controle de Sessão e Privilégios RBAC", () => {
  test("deve validar o fluxo de autenticação de administrador com acesso às rotas", async ({
    loginPage,
    sidebar,
    page,
  }) => {
    await loginPage.navigateTo();

    // Registra a escuta do evento de rede para mitigar respostas fantasma
    const loginResponse = page.waitForResponse(
      (response) =>
        response.url().includes("auth/login") && response.status() === 200,
    );

    // Executa as ações no formulário
    await loginPage.performLogin("admin@email.com", "password");
    await loginResponse;

    // MELHOR PRÁTICA: Em vez de forçar page.goto(), aguarda que a SPA se hidrate
    // e monte a barra lateral administrativa estrutural de forma natural na tela.
    await expect(sidebar.navigationContainer).toBeVisible({ timeout: 5000 });

    // Garante que o redirecionamento interno do React Router v7 foi concluído com sucesso
    await expect(page).toHaveURL(/.*\/admin\/dashboard/);

    // Valida a presença de todos os controlos de acesso do menu real
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

    // Tenta forçar a entrada direta na área restrita por URL para validar a barreira do AdminLayout
    await page.goto("/admin/dashboard");

    // Confirma que o useEffect do AdminLayout baniu o utilizador de volta à raiz de clientes
    await expect(page).not.toHaveURL("**/admin/dashboard");
    await expect(page).toHaveURL("/");
  });
});
