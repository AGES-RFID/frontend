import z from "zod";

export const userRoleEnumSchema = z.preprocess(
  (val) => {
    if (typeof val === "string") return val.toLowerCase();
    if (typeof val === "number") return val === 0 ? "admin" : "customer";
    return val;
  },
  z.enum(["admin", "customer"]),
);

export type UserRoleEnum = z.infer<typeof userRoleEnumSchema>;
