import { z } from "zod";
import { userRoleSchema } from "./userRoleEnum";

export const userSchema = z.object({
  userId: z.uuid(),
  name: z.string(),
  email: z.email(),
  role: userRoleSchema,
});

export type UserDto = z.infer<typeof userSchema>;
