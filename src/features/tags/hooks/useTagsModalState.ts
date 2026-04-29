import { useState } from "react";
import type { TagListItemDto } from "../dtos";

type ModalType = "details" | "create" | "deactivate" | null;

export function useTagsModalState() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedTag, setSelectedTag] = useState<TagListItemDto | null>(null);

  const open = (type: Exclude<ModalType, null>, tag?: TagListItemDto) => {
    setActiveModal(type);
    setSelectedTag(type === "create" ? null : (tag ?? null));
  };

  const close = () => {
    setActiveModal(null);
    setSelectedTag(null);
  };

  return { activeModal, selectedTag, open, close };
}
