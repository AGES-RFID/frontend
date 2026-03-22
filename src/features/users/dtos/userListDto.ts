import z from "zod";
import { userSchema } from "./userDto";

export const userListSchema = z.array(userSchema);

export type UserListDto = z.infer<typeof userListSchema>;
