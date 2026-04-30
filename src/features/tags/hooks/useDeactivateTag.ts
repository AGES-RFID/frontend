import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tagService } from "../TagService";

export function useDeactivateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tagId: string) => tagService.deactivateTag(tagId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-tags"] });
    },
  });
}
