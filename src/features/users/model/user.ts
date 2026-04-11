export type UserType = "Admin" | "Cliente";

export type User = {
  id: string;
  type: UserType;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};
