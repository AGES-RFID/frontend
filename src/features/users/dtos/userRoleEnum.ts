import z from "zod";

export const userRoleEnumSchema = z.enum(["admin", "customer"]);

export type UserRoleEnum = z.infer<typeof userRoleEnumSchema>;
