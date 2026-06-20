import type { APIRequestContext, BrowserContext } from "@playwright/test";

export class ApiOrchestrator {
  private readonly request: APIRequestContext;
  private readonly apiUrl: string;
  private adminToken: string | null = null;
  private adminId: string | null = null;
  private epcToTidMap = new Map<string, string>();

  constructor(request: APIRequestContext) {
    this.request = request;
    const baseEnvUrl = process.env.PUBLIC_API_URL ?? "http://localhost:5000";

    const cleanBaseUrl = baseEnvUrl.replace(/\/$/, "");
    this.apiUrl = cleanBaseUrl.endsWith("/api")
      ? cleanBaseUrl
      : `${cleanBaseUrl}/api`;
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
        this.adminToken = json.token || json.Token;
        const userObj = json.user || json.User;
        if (userObj) {
          this.adminId =
            userObj.id || userObj.Id || userObj.userId || userObj.UserId;
        }
      } else {
        const err = await response.text();
        console.error(
          `[API Setup] Falha no Login Automático. URL: ${this.apiUrl}/auth/login | Status: ${response.status()} - Body: ${err}`,
        );
      }
    }

    return {
      "Content-Type": "application/json",
      ...(this.adminToken
        ? { Authorization: `Bearer ${this.adminToken}` }
        : {}),
    };
  }

  private async getAdminId(): Promise<string> {
    if (this.adminId) return this.adminId;

    const headers = await this.getAuthHeaders();
    const response = await this.request.get(`${this.apiUrl}/auth/me`, {
      headers,
    });

    if (response.ok()) {
      const json = await response.json();
      this.adminId = json.id || json.Id || json.userId || json.UserId;
      return this.adminId!;
    }

    const errText = await response.text();
    throw new Error(
      `[API Setup] Failed to fetch /auth/me. URL: ${this.apiUrl}/auth/me | Status: ${response.status()}. Body: ${errText}`,
    );
  }

  async setupActiveVehicleWithTag(plate: string, epc: string): Promise<string> {
    const headers = await this.getAuthHeaders();
    const ownerId = await this.getAdminId();

    const vehicleResponse = await this.request.post(`${this.apiUrl}/vehicles`, {
      headers,
      data: {
        plate,
        model: "E2E Test Vehicle",
        brand: "Toyota",
        ownerId: ownerId,
      },
    });

    if (!vehicleResponse.ok()) {
      const errText = await vehicleResponse.text();
      throw new Error(
        `[API Setup] Vehicle creation failed (${vehicleResponse.status()}): ${errText}`,
      );
    }

    const vehicleData = await vehicleResponse.json();
    const vehicleId = vehicleData.vehicleId ?? vehicleData.id ?? vehicleData.Id;

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
      const errText = await tagResponse.text();
      throw new Error(
        `[API Setup] Tag creation failed (${tagResponse.status()}): ${errText}`,
      );
    }

    const tagData = await tagResponse.json();
    const tagId = tagData.tagId ?? tagData.id ?? tagData.Id;

    const assignResponse = await this.request.patch(
      `${this.apiUrl}/tags/${tagId}/assign-vehicle`,
      {
        headers,
        data: { vehicleId },
      },
    );

    if (!assignResponse.ok()) {
      const errText = await assignResponse.text();
      throw new Error(
        `[API Setup] Tag assignment failed (${assignResponse.status()}): ${errText}`,
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
