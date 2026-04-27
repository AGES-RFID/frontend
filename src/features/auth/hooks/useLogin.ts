import { useMutation } from "@tanstack/react-query";
import { authService } from "../AuthService";

export function useLogin() {
  return useMutation({
    mutationFn: authService.login.bind(authService),
  });
}
