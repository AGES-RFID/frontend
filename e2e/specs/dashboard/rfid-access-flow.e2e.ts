import { test, expect } from "../../fixtures/base.fixture";

test.describe("Fluxo Crítico RFID - Entrada, Saída e Tentativas Inválidas", () => {
  let uniquePlate: string;
  let uniqueVehicleId: string;

  test.afterEach(async ({ orchestrator }) => {
    if (uniqueVehicleId) {
      await orchestrator.cleanupVehicle(uniqueVehicleId);
      uniqueVehicleId = "";
    }
  });

  test("deve registrar entrada de veiculo autorizado e atualizar metricas de ocupacao", async ({
    dashboardPage,
    orchestrator,
    page,
  }) => {
    const uniqueEpc = orchestrator.generateRandomEpc();
    uniquePlate = orchestrator.generateRandomPlate();

    uniqueVehicleId = await orchestrator.setupActiveVehicleWithTag(
      uniquePlate,
      uniqueEpc,
    );

    await Promise.all([
      page.waitForResponse(
        (res) => res.url().includes("/api/dashboard") && res.status() === 200,
      ),
      dashboardPage.navigateTo(),
    ]);

    const entradasCard = page
      .locator("div.bg-white")
      .filter({ hasText: "Entradas (Última Hora)" });
    const entradasCounter = entradasCard.locator("span.font-bold");

    await expect(entradasCounter).toBeVisible();

    const rawTextInicial = await entradasCounter.innerText();
    const entradasIniciais = Number.parseInt(rawTextInicial.trim() || "0", 10);

    await orchestrator.simulateRfidTagRead(uniqueEpc, true);
    await page.reload();

    const entradasEsperadas = String(entradasIniciais + 1);
    await expect(entradasCounter).toHaveText(
      new RegExp(`^${entradasEsperadas}\\s*$`),
      {
        timeout: 10000,
      },
    );
  });

  test("deve registrar saida de veiculo e atualizar a metrica de saidas no dashboard", async ({
    dashboardPage,
    orchestrator,
    page,
  }) => {
    const uniqueEpc = orchestrator.generateRandomEpc();
    uniquePlate = orchestrator.generateRandomPlate();

    uniqueVehicleId = await orchestrator.setupActiveVehicleWithTag(
      uniquePlate,
      uniqueEpc,
    );

    await orchestrator.simulateRfidTagRead(uniqueEpc, true);

    await Promise.all([
      page.waitForResponse(
        (res) => res.url().includes("/api/dashboard") && res.status() === 200,
      ),
      dashboardPage.navigateTo(),
    ]);

    const saidasCard = page
      .locator("div.bg-white")
      .filter({ hasText: "Saídas (Última Hora)" });
    const saidasCounter = saidasCard.locator("span.font-bold");
    await expect(saidasCounter).toBeVisible();

    const rawTextInicial = await saidasCounter.innerText();
    const saidasIniciais = Number.parseInt(rawTextInicial.trim() || "0", 10);

    await orchestrator.simulateRfidTagRead(uniqueEpc, false);
    await page.reload();

    const saidasEsperadas = String(saidasIniciais + 1);
    await expect(saidasCounter).toHaveText(
      new RegExp(`^${saidasEsperadas}\\s*$`),
      {
        timeout: 10000,
      },
    );
  });

  test("deve recusar acesso de etiqueta rfid fantasma sem comprometer o sistema", async ({
    dashboardPage,
    orchestrator,
    page,
  }) => {
    const ghostEpc = orchestrator.generateRandomEpc();

    await expect(
      orchestrator.simulateRfidTagRead(ghostEpc, true),
    ).rejects.toThrow();

    await Promise.all([
      page.waitForResponse(
        (res) => res.url().includes("/api/dashboard") && res.status() === 200,
      ),
      dashboardPage.navigateTo(),
    ]);

    await expect(
      page.getByRole("heading", { name: "Dashboard" }),
    ).toBeVisible();
  });
});
