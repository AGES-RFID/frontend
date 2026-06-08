import { describe, expect, it } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import type { TagListItemDto } from "../dtos";
import { useTagsModalState } from "./useTagsModalState";

const mockTag: TagListItemDto = {
  tagId: "tag-001",
  tid: "TID-001",
  epc: "EPC-001",
  userName: "John Doe",
  plate: "ABC-1234",
  status: "IN_USE",
};

describe("useTagsModalState hook", () => {
  it("should initialize with no active modal and no selected tag", () => {
    const { result } = renderHook(() => useTagsModalState());
    expect(result.current.activeModal).toBeNull();
    expect(result.current.selectedTag).toBeNull();
  });

  it("should open the details modal with the given tag", () => {
    const { result } = renderHook(() => useTagsModalState());
    act(() => result.current.open("details", mockTag));
    expect(result.current.activeModal).toBe("details");
    expect(result.current.selectedTag).toEqual(mockTag);
  });

  it("should open the deactivate modal with the given tag", () => {
    const { result } = renderHook(() => useTagsModalState());
    act(() => result.current.open("deactivate", mockTag));
    expect(result.current.activeModal).toBe("deactivate");
    expect(result.current.selectedTag).toEqual(mockTag);
  });

  it("should open the create modal and set selectedTag to null", () => {
    const { result } = renderHook(() => useTagsModalState());
    act(() => result.current.open("create", mockTag));
    expect(result.current.activeModal).toBe("create");
    expect(result.current.selectedTag).toBeNull();
  });

  it("should open the create modal without a tag", () => {
    const { result } = renderHook(() => useTagsModalState());
    act(() => result.current.open("create"));
    expect(result.current.activeModal).toBe("create");
    expect(result.current.selectedTag).toBeNull();
  });

  it("should close the modal and clear the selected tag", () => {
    const { result } = renderHook(() => useTagsModalState());
    act(() => result.current.open("details", mockTag));
    act(() => result.current.close());
    expect(result.current.activeModal).toBeNull();
    expect(result.current.selectedTag).toBeNull();
  });

  it("should switch from one modal to another", () => {
    const { result } = renderHook(() => useTagsModalState());
    act(() => result.current.open("details", mockTag));
    act(() => result.current.open("deactivate", mockTag));
    expect(result.current.activeModal).toBe("deactivate");
  });
});
