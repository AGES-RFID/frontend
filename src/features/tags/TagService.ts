import { type ApiClient, api } from "@/lib/api";
import { type CreateTagDto, type TagDto, tagSchema } from "./dtos";

export class TagService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async createTag(createTagDto: CreateTagDto): Promise<TagDto> {
    const tag = await this.apiClient
      .post("tags", { json: createTagDto })
      .json(tagSchema);

    return tag;
  }
}

export const tagService = new TagService(api);
