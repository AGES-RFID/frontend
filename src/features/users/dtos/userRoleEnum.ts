import z from "zod";

export const userRoleSchema = z.enum(["admin", "customer"]);

export type UserRoleEnum = z.infer<typeof userRoleSchema>;
