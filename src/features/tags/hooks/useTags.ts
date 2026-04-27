import { useQuery } from "@tanstack/react-query";
import { tagService } from "../TagService";

export function useTags() {
  return useQuery({
    queryKey: ["admin-tags"],
    queryFn: () => tagService.listTags(),
  });
}
