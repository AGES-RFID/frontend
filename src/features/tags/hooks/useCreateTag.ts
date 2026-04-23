import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateTagDto } from "../dtos";
import { tagService } from "../TagService";

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (createTagDto: CreateTagDto) =>
      tagService.createTag(createTagDto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-tags"] });
    },
  });
}
