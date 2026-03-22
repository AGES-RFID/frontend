import { z } from "zod";

export const userSchema = z.object({
  userId: z.uuidv4(),
  name: z.string(),
});

export type UserDto = z.infer<typeof userSchema>;
