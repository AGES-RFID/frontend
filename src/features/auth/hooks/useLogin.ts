import { useMutation } from "@tanstack/react-query";
import { authService } from "../AuthService";
import type { LoginDto } from "../dtos";

export function useLogin() {
  return useMutation({
    mutationFn: (loginDto: LoginDto) => authService.login(loginDto),
  });
}
