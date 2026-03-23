import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateUserDto } from "../dtos";
import { userService } from "../UserService";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (createUserDto: CreateUserDto) =>
      userService.createUser(createUserDto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
