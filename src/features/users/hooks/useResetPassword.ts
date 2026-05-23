import { useMutation } from "@tanstack/react-query";
import {
  type AuthService,
  authService as defaultAuthService,
} from "@/features/auth/AuthService";
import { type ApiClient, api as defaultApi } from "@/lib/api";

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

// Função exportada com injeção de dependências para facilitar testes unitários
export async function resetPasswordFn(
  variables: ResetPasswordVariables,
  deps: { authService: AuthService; apiClient: ApiClient } = {
    authService: defaultAuthService,
    apiClient: defaultApi,
  },
): Promise<void> {
  const { userId, userEmail, currentPassword, password } = variables;

  try {
    await deps.authService.login({
      email: userEmail,
      password: currentPassword,
    });
  } catch {
    throw new InvalidCurrentPasswordException();
  }

  await deps.apiClient.patch(`users/${userId}`, { json: { password } });
}

export function useResetPassword() {
  return useMutation<void, Error, ResetPasswordVariables>({
    mutationFn: (variables) => resetPasswordFn(variables),
  });
}
