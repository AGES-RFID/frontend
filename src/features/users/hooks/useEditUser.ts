import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateUserDto } from "../dtos";
import { userService } from "../UserService";

export type EditUserVariables = {
  userId: string;
  updateUserDto: Partial<CreateUserDto>;
};

export function useEditUser() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, EditUserVariables>({
    mutationFn: ({ userId, updateUserDto }) =>
      userService.editUser(userId, updateUserDto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
