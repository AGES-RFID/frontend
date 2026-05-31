import { z } from "zod";
import { type ApiClient, api } from "@/lib/api";
import {
  type ParkingPricesDto,
  parkingPricesSchema,
  type UpdateParkingPricesDto,
} from "./dtos/parkingPricesDto";

const parkingPricesListSchema = z.array(parkingPricesSchema);

const getDateTimestamp = (value?: string): number => {
  if (!value) return 0;

  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};

export class ParkingPricesService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getPricing(): Promise<ParkingPricesDto> {
    const prices = await this.apiClient
      .get("parking-prices")
      .json(parkingPricesListSchema);

    const [currentPricing] = [...prices].sort((a, b) => {
      const byUpdatedAt =
        getDateTimestamp(b.updatedAt) - getDateTimestamp(a.updatedAt);

      if (byUpdatedAt !== 0) return byUpdatedAt;

      return getDateTimestamp(b.createdAt) - getDateTimestamp(a.createdAt);
    });

    if (!currentPricing) throw new Error("Preços não encontrados");

    return currentPricing;
  }

  async updatePricing(
    parkingPriceId: string,
    updateDto: UpdateParkingPricesDto,
  ): Promise<void> {
    await this.apiClient
      .patch(`parking-prices/${parkingPriceId}`, { json: updateDto })
      .json();
  }
}

export const parkingPricesService = new ParkingPricesService(api);
