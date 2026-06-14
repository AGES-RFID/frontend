import { z } from "zod";
import { type ApiClient, api } from "@/lib/api";
import {
  type AccessDto,
  type AccessTypeEnum,
  accessDtoSchema,
  type TimeseriesResponseDto,
  timeseriesResponseSchema,
} from "./dtos";

const accessListSchema = z.array(accessDtoSchema);

export class AccessesService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getAccesses(accessType?: AccessTypeEnum): Promise<AccessDto[]> {
    const accesses = await this.apiClient
      .get("accesses", {
        searchParams: accessType ? { accessType } : undefined,
      })
      .json(accessListSchema);

    return accesses;
  }

  async getRecentExits(): Promise<AccessDto[]> {
    return this.getAccesses("exit");
  }

  async getTimeseries(): Promise<TimeseriesResponseDto> {
    return this.apiClient
      .get("accesses/timeseries")
      .json(timeseriesResponseSchema);
  }
}

export const accessesService = new AccessesService(api);
