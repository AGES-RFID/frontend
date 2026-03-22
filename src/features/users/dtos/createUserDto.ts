import z from "zod";

export const createUserSchema = z.object({
  name: z.string(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
