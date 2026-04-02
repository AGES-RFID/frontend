import { EditIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import type { UserDto } from "../dtos";
import { useDeleteUser } from "../hooks";

type UserCardProps = {
  user: UserDto;
};

export function UserCard({ user }: UserCardProps) {
  const deleteUserMutation = useDeleteUser();

  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-light-blue p-2">
      <div>
        <p>{user.name}</p>
        <p className="text-dark-gray text-sm">{user.email}</p>
      </div>

      <div className="flex items-center gap-1">
        <Link to={`/users/${user.userId}/edit`}>
          <Button icon>
            <EditIcon size={16} />
          </Button>
        </Link>

        <Button
          icon
          disabled={deleteUserMutation.isPending}
          onClick={() => deleteUserMutation.mutate({ userId: user.userId })}
        >
          <Trash2Icon size={16} />
        </Button>
      </div>
    </div>
  );
}
