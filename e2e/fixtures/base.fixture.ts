import { test as baseTest, expect } from "@playwright/test";
import { DashboardPage } from "../pages/dashboard.page";
import { LoginPage } from "../pages/login.page";
import { TagsPage } from "../pages/tags.page";
import { SidebarComponent } from "../components/sidebar.component";
import { ApiOrchestrator } from "../utils/api-orchestrator";

interface E2EFixtures {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  tagsPage: TagsPage;
  sidebar: SidebarComponent;
  orchestrator: ApiOrchestrator;
}

export const test = baseTest.extend<E2EFixtures>({
  orchestrator: async ({ request, context }, use) => {
    const orchestrator = new ApiOrchestrator(request);

    // Carrega o token da sessão salva pelo globalSetup.
    // Se o projeto não tiver storageState (ex: chromium-auth), isso não vai
    // encontrar o token e vai lançar erro somente se algum método autenticado
    // for chamado — o que é o comportamento correto.
    try {
      await orchestrator.loadTokenFromContext(context);
    } catch {
      // Projeto sem storageState (testes de auth puro) — ignorar silenciosamente
    }

    await use(orchestrator);
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  tagsPage: async ({ page }, use) => {
    await use(new TagsPage(page));
  },

  sidebar: async ({ page }, use) => {
    await use(new SidebarComponent(page));
  },
});

export { expect };
