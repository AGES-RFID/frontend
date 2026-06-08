import { test, expect } from "../../fixtures/base.fixture";

test.describe("Dashboard - Monitoramento de Ocupação e Auditoria de Eventos EDA", () => {
  let uniquePlate: string;
  let uniqueVehicleId: string;

  test("deve processar e sincronizar em tempo real o incremento de ocupacao e geracao de logs de auditoria apos evento RFID", async ({
    dashboardPage,
    orchestrator,
  }) => {
    const uniqueEpc = orchestrator.generateRandomEpc();
    uniquePlate = orchestrator.generateRandomPlate();

    uniqueVehicleId = await orchestrator.setupActiveVehicleWithTag(
      uniquePlate,
      uniqueEpc,
    );

    // A autenticação já é fornecida pelo storageState (admin.json)
    await dashboardPage.navigateTo();

    await expect(dashboardPage.availableVagasCounter).toHaveText(/\d+\/\d+/);

    const rawTextInicial =
      await dashboardPage.availableVagasCounter.innerText();

    const [vehiclesCountStr, totalSpotsStr] = rawTextInicial.split("/");

    const carrosPresentesIniciais = Number.parseInt(
      vehiclesCountStr?.trim() || "0",
      10,
    );

    const totalSpots = totalSpotsStr?.trim() || "0";

    await orchestrator.simulateRfidTagRead(uniqueEpc);

    const textoFracaoEsperado = `${carrosPresentesIniciais + 1}/${totalSpots}`;

    await expect(dashboardPage.availableVagasCounter).toHaveText(
      textoFracaoEsperado,
    );

    await expect(dashboardPage.recentExitsTable).toContainText(uniquePlate);
  });

  test.afterEach(async ({ orchestrator }) => {
    if (uniqueVehicleId) {
      await orchestrator.cleanupVehicle(uniqueVehicleId);
    }
  });
});
