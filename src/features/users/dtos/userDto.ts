import { z } from "zod";

export const userSchema = z.object({
  userId: z.uuid(),
  name: z.string(),
  email: z.email(),
});

export type UserDto = z.infer<typeof userSchema>;
