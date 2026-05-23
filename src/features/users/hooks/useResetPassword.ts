import { useMutation } from "@tanstack/react-query";
import { authService } from "@/features/auth/AuthService";
import { api } from "@/lib/api";

export type ResetPasswordVariables = {
  userId: string;
  userEmail: string;
  currentPassword: string;
  password: string;
};

export class InvalidCurrentPasswordException extends Error {
  constructor() {
    super("Senha atual incorreta.");
  }
}

export function useResetPassword() {
  return useMutation<void, Error, ResetPasswordVariables>({
    mutationFn: async ({ userId, userEmail, currentPassword, password }) => {
      // Verifica se a senha atual está correta antes de atualizar
      try {
        await authService.login({
          email: userEmail,
          password: currentPassword,
        });
      } catch {
        throw new InvalidCurrentPasswordException();
      }

      await api.patch(`users/${userId}`, { json: { password } });
    },
  });
}
