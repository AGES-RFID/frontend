import { z } from "zod";
import { userRoleEnumSchema } from "./userRoleEnum";

export const userSchema = z.object({
  userId: z.uuid(),
  name: z.string(),
  email: z.email(),
  role: userRoleEnumSchema,
  balance: z.number(),
  cpf: z.string().optional(),
  cellphone: z.string().optional(),
});

export type UserDto = z.infer<typeof userSchema>;
