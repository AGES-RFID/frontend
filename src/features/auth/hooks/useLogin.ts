import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../AuthService";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login.bind(authService),
    onSuccess: async () => {
      await queryClient.resetQueries({ queryKey: ["me"] });
    },
  });
}
