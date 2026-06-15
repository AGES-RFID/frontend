import type { APIRequestContext, BrowserContext } from "@playwright/test";

export class ApiOrchestrator {
  private readonly request: APIRequestContext;
  private readonly apiUrl: string;
  private adminToken: string | null = null;
  private epcToTidMap = new Map<string, string>();

  constructor(request: APIRequestContext) {
    this.request = request;
    const baseEnvUrl = process.env.PUBLIC_API_URL ?? "http://localhost:5000";
    this.apiUrl =
      baseEnvUrl.endsWith("/api") || baseEnvUrl.endsWith("/api/")
        ? baseEnvUrl
        : `${baseEnvUrl.replace(/\/$/, "")}/api`;
  }

  async loadTokenFromContext(context: BrowserContext): Promise<void> {
    const state = await context.storageState();

    for (const origin of state.origins) {
      const tokenItem = origin.localStorage.find(
        (item) => item.name === "rfid-auth-token",
      );

      if (tokenItem) {
        this.adminToken = tokenItem.value.replace(/^"|"$/g, "");
        return;
      }
    }
  }

  generateRandomPlate(): string {
    return `E2E${Math.floor(1000 + Math.random() * 9000)}`;
  }

  generateRandomEpc(): string {
    return `EPC${Date.now()}${Math.floor(Math.random() * 100)}`;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    if (!this.adminToken) {
      const response = await this.request.post(`${this.apiUrl}/auth/login`, {
        data: { email: "admin@email.com", password: "password" },
      });
      if (response.ok()) {
        const json = await response.json();
        this.adminToken = json.token;
      }
    }
    return {
      "Content-Type": "application/json",
      ...(this.adminToken
        ? { Authorization: `Bearer ${this.adminToken}` }
        : {}),
    };
  }

  async setupActiveVehicleWithTag(plate: string, epc: string): Promise<string> {
    const headers = await this.getAuthHeaders();

    const vehicleResponse = await this.request.post(`${this.apiUrl}/vehicles`, {
      headers,
      data: {
        plate,
        model: "E2E Test Vehicle",
        brand: "Toyota",
      },
    });

    if (!vehicleResponse.ok()) {
      throw new Error(
        `[API Setup] Vehicle creation failed (${vehicleResponse.status()})`,
      );
    }

    const vehicleData = await vehicleResponse.json();
    const vehicleId = vehicleData.vehicleId;

    const uniqueTid = `TID${Date.now()}${Math.floor(Math.random() * 100)}`;

    this.epcToTidMap.set(epc, uniqueTid);

    const tagResponse = await this.request.post(`${this.apiUrl}/tags`, {
      headers,
      data: {
        Epc: epc,
        Tid: uniqueTid,
      },
    });

    if (!tagResponse.ok()) {
      throw new Error(
        `[API Setup] Tag creation failed (${tagResponse.status()})`,
      );
    }

    const tagData = await tagResponse.json();
    const tagId = tagData.tagId;

    const assignResponse = await this.request.patch(
      `${this.apiUrl}/tags/${tagId}/assign-vehicle`,
      {
        headers,
        data: {
          vehicleId,
        },
      },
    );

    if (!assignResponse.ok()) {
      throw new Error(
        `[API Setup] Tag assignment failed (${assignResponse.status()})`,
      );
    }

    return vehicleId;
  }

  async cleanupVehicle(vehicleId: string): Promise<void> {
    const headers = await this.getAuthHeaders();
    const response = await this.request.delete(
      `${this.apiUrl}/vehicles/${vehicleId}`,
      { headers },
    );

    if (!response.ok() && response.status() !== 404) {
      console.warn(
        `[API Cleanup] Failed to delete vehicle with ID ${vehicleId}`,
      );
    }
  }

  async simulateRfidTagRead(
    epc: string,
    entrance: boolean = true,
  ): Promise<void> {
    const headers = await this.getAuthHeaders();
    const tid = this.epcToTidMap.get(epc) || epc;

    const response = await this.request.post(`${this.apiUrl}/accesses`, {
      headers,
      data: {
        Epc: epc,
        Tid: tid,
        Entrance: entrance,
      },
    });

    if (!response.ok()) {
      throw new Error(
        `[RFID Simulation] Failed (${response.status()}) - ${await response.text()}`,
      );
    }
  }
}
