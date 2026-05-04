import { z } from "zod";
import { userSchema } from "@/features/users/dtos";

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

export const authResponseSchema = z.object({
  token: z.string(),
  user: userSchema,
});

export type LoginDto = z.infer<typeof loginSchema>;
export type AuthResponseDto = z.infer<typeof authResponseSchema>;
