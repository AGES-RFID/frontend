import { type ApiClient, api } from "@/lib/api";
import type { AntennaDto, UpdateAntennaDto } from "./dtos";

export class AntennaService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getAntennas(): Promise<AntennaDto[]> {
    const response = await this.apiClient
      .get("system/antennas")
      .json<AntennaDto[]>();

    return response;
  }

  async updateAntenna(
    antennaId: string,
    updateDto: UpdateAntennaDto,
  ): Promise<AntennaDto> {
    const response = await this.apiClient
      .put(`system/antennas/${antennaId}`, { json: updateDto })
      .json<AntennaDto>();

    return response;
  }
}

export const antennaService = new AntennaService(api);
