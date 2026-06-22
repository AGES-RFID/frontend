import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tagService } from "../TagService";

export function useBulkCreateTags() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => tagService.bulkCreateTags(file),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-tags"] });
    },
  });
}
