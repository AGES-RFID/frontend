import { z } from "zod";
import { type ApiClient, api } from "@/lib/api";
import { type AccessDto, type AccessTypeEnum, accessDtoSchema } from "./dtos";

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
}

export const accessesService = new AccessesService(api);
