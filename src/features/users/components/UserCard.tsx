import type { UserDto } from "../dtos";

type UserCardProps = {
  user: UserDto;
};

export function UserCard({ user }: UserCardProps) {
  return <div className="rounded-md border p-2">{user.name}</div>;
}
