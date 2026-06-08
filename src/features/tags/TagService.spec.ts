import { beforeEach, describe, expect, it, mock } from "bun:test";
import { type ApiClient, api } from "@/lib/api";
import { jsonResponse } from "/test/utils/makeResponse";
import { TagService } from "./TagService";

const mockTag = {
  tagId: "tag-001",
  tid: "TID-001",
  epc: "EPC-001",
  status: "AVAILABLE",
  vehicleId: null,
};

const mockTagListItem = {
  tagId: "tag-001",
  tid: "TID-001",
  epc: "EPC-001",
  userName: "John Doe",
  plate: "ABC-1234",
  status: "AVAILABLE",
};

describe("TagService", () => {
  describe("listTags", () => {
    let fetchMock = mock();
    let apiMock: ApiClient;
    let tagService: TagService;

    beforeEach(() => {
      fetchMock = mock();
      apiMock = api.extend({ fetch: fetchMock });
      tagService = new TagService(apiMock);
    });

    it("should call GET /tags", async () => {
      fetchMock.mockImplementationOnce(async () => jsonResponse([]));
      await tagService.listTags();

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [request] = fetchMock.mock.calls[0] ?? [];
      if (!request) throw new Error("Expected a request to be sent");
      expect(request).toBeInstanceOf(Request);
      expect(request.url).toContain("/tags");
      expect(request.method).toBe("GET");
    });

    it("should return the tag list with correct data", async () => {
      fetchMock.mockImplementationOnce(async () =>
        jsonResponse([mockTagListItem]),
      );

      const result = await tagService.listTags();

      expect(result).toHaveLength(1);
      expect(result[0]?.tagId).toBe("tag-001");
      expect(result[0]?.status).toBe("AVAILABLE");
    });

    it("should return an empty array when the api returns an empty list", async () => {
      fetchMock.mockImplementationOnce(async () => jsonResponse([]));

      const result = await tagService.listTags();

      expect(result).toEqual([]);
    });

    it("should throw when the api returns invalid data", async () => {
      fetchMock.mockImplementationOnce(async () =>
        jsonResponse({ invalid: true }),
      );

      expect(tagService.listTags()).rejects.toBeDefined();
    });

    it("should throw when a tag item has an invalid status value", async () => {
      fetchMock.mockImplementationOnce(async () =>
        jsonResponse([{ ...mockTagListItem, status: "UNKNOWN_STATUS" }]),
      );

      expect(tagService.listTags()).rejects.toBeDefined();
    });
  });

  describe("createTag", () => {
    let fetchMock = mock();
    let apiMock: ApiClient;
    let tagService: TagService;

    beforeEach(() => {
      fetchMock = mock();
      apiMock = api.extend({ fetch: fetchMock });
      tagService = new TagService(apiMock);
    });

    it("should call POST /tags with the correct payload", async () => {
      const createTagDto = { tid: "TID-999", epc: "EPC-999" };
      fetchMock.mockImplementationOnce(async () => jsonResponse(mockTag));

      await tagService.createTag(createTagDto);

      const [request] = fetchMock.mock.calls[0] ?? [];
      if (!request) throw new Error("Expected a request to be sent");
      expect(request.url).toContain("/tags");
      expect(request.method).toBe("POST");
      expect(request.headers.get("Content-Type")).toBe("application/json");
      const body = await request.clone().json();
      expect(body).toEqual(createTagDto);
    });

    it("should return the created tag with correct data", async () => {
      fetchMock.mockImplementationOnce(async () => jsonResponse(mockTag));

      const result = await tagService.createTag({
        tid: "TID-001",
        epc: "EPC-001",
      });

      expect(result.tagId).toBe("tag-001");
      expect(result.status).toBe("AVAILABLE");
    });

    it("should throw when the api returns invalid data", async () => {
      fetchMock.mockImplementationOnce(async () =>
        jsonResponse({ invalid: true }),
      );

      expect(
        tagService.createTag({ tid: "TID-001", epc: "EPC-001" }),
      ).rejects.toBeDefined();
    });
  });

  describe("deactivateTag", () => {
    let fetchMock = mock();
    let apiMock: ApiClient;
    let tagService: TagService;

    beforeEach(() => {
      fetchMock = mock();
      apiMock = api.extend({ fetch: fetchMock });
      tagService = new TagService(apiMock);
    });

    it("should call PATCH /tags/:id/deactivate", async () => {
      const tagId = "tag-001";
      fetchMock.mockImplementationOnce(async () =>
        jsonResponse({ ...mockTag, status: "INACTIVE" }),
      );

      await tagService.deactivateTag(tagId);

      const [request] = fetchMock.mock.calls[0] ?? [];
      if (!request) throw new Error("Expected a request to be sent");
      expect(request.url).toContain(`/tags/${tagId}/deactivate`);
      expect(request.method).toBe("PATCH");
    });

    it("should return the deactivated tag with updated status", async () => {
      fetchMock.mockImplementationOnce(async () =>
        jsonResponse({ ...mockTag, status: "INACTIVE" }),
      );

      const result = await tagService.deactivateTag("tag-001");

      expect(result.tagId).toBe("tag-001");
      expect(result.status).toBe("INACTIVE");
    });

    it("should throw when the api returns invalid data", async () => {
      fetchMock.mockImplementationOnce(async () =>
        jsonResponse({ invalid: true }),
      );

      expect(tagService.deactivateTag("tag-001")).rejects.toBeDefined();
    });
  });
});
