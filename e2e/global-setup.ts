import { chromium } from "@playwright/test";

async function globalSetup() {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const browser = await chromium.launch();

  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  await adminPage.goto(frontendUrl);
  await adminPage.fill('[placeholder="Digite seu email"]', "admin@email.com");
  await adminPage.fill('[placeholder="Digite sua senha"]', "password");

  const adminLoginResponse = adminPage.waitForResponse(
    (response) =>
      response.url().includes("auth/login") && response.status() === 200,
  );
  await adminPage.click('button:has-text("Entrar")');
  await adminLoginResponse;

  await adminPage.waitForLoadState("networkidle");
  await adminContext.storageState({ path: "e2e/.auth/admin.json" });

  const customerContext = await browser.newContext();
  const customerPage = await customerContext.newPage();
  await customerPage.goto(frontendUrl);
  await customerPage.fill(
    '[placeholder="Digite seu email"]',
    "cliente@email.com",
  );
  await customerPage.fill('[placeholder="Digite sua senha"]', "password");

  const customerLoginResponse = customerPage.waitForResponse(
    (response) =>
      response.url().includes("auth/login") && response.status() === 200,
  );
  await customerPage.click('button:has-text("Entrar")');
  await customerLoginResponse;

  await customerPage.waitForLoadState("networkidle");
  await customerContext.storageState({ path: "e2e/.auth/customer.json" });

  await browser.close();
}

export default globalSetup;
