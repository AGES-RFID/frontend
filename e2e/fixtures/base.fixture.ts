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

    try {
      await orchestrator.loadTokenFromContext(context);
    } catch {}

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
