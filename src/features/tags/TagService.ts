import { type ApiClient, api } from "@/lib/api";
import {
  type CreateTagDto,
  type TagDto,
  type TagListItemDto,
  tagListSchema,
  tagSchema,
} from "./dtos";

export class TagService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async listTags(): Promise<TagListItemDto[]> {
    return this.apiClient.get("tags").json(tagListSchema);
  }

  async createTag(createTagDto: CreateTagDto): Promise<TagDto> {
    return this.apiClient.post("tags", { json: createTagDto }).json(tagSchema);
  }

  async deactivateTag(tagId: string): Promise<TagDto> {
    return this.apiClient.patch(`tags/${tagId}/deactivate`).json(tagSchema);
  }
}

export const tagService = new TagService(api);
