import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../UserService";

export type DeleteUserVariables = {
  userId: string;
};

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, DeleteUserVariables>({
    mutationFn: ({ userId }) => userService.deleteUser(userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
