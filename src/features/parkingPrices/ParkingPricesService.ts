import { type ApiClient, api } from "@/lib/api";
import {
  type ParkingPricesListDto,
  type ParkingPricesDto,
  parkingPricesListSchema,
  parkingPricesSchema,
  type UpdateParkingPriceDto,
} from "./dtos";

export class ParkingPricesService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getParkingPriceById(parkingPriceId: string): Promise<ParkingPricesDto> {
    return this.apiClient
      .get(`parking-prices/${parkingPriceId}`)
      .json(parkingPricesSchema);
  }

  async listParkingPrices(): Promise<ParkingPricesListDto> {
    return this.apiClient.get("parking-prices").json(parkingPricesListSchema);
  }

  async updateParkingPrice(
    parkingPriceId: string,
    updateParkingPriceDto: UpdateParkingPriceDto,
  ): Promise<ParkingPricesDto> {
    return this.apiClient
      .patch(`parking-prices/${parkingPriceId}`, {
        json: updateParkingPriceDto,
      })
      .json(parkingPricesSchema);
  }
}

export const parkingPricesService = new ParkingPricesService(api);
