import { z } from "zod";
import { type ApiClient, api } from "@/lib/api";
import {
  type ParkingPricesDto,
  parkingPricesSchema,
  type UpdateParkingPricesDto,
} from "./dtos/parkingPricesDto";

export class ParkingPricesService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getPricing(): Promise<ParkingPricesDto> {
    const prices = await this.apiClient
      .get("parking-prices")
      .json(z.union([parkingPricesSchema, z.array(parkingPricesSchema)]));
    const result = Array.isArray(prices) ? prices[0] : prices;
    if (!result) throw new Error("Preços não encontrados");
    return result;
  }

  async updatePricing(updateDto: UpdateParkingPricesDto): Promise<void> {
    // Como só há 1 registro global ou ele pega o ativo, assumimos endpoint PUT global ou passando current
    await this.apiClient.put("parking-prices", { json: updateDto }).json();
  }
}

export const parkingPricesService = new ParkingPricesService(api);
