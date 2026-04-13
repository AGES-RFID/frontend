import { useEffect } from "react";
import { useUsers } from "../hooks/useUsers";
import { UserCard } from "./UserCard";
import { toast } from "@/components/ui/toast";

export function UserList() {
  const { data: users, status, error } = useUsers();

  useEffect(() => {
    if (status === "error") {
      toast.error("Algo deu errado ao buscar os usuários.");
    }
  }, [status]);

  if (status === "pending") {
    return <div>Carregando...</div>;
  }
  if (status === "error") {
    console.log(error);
    return (
      <div className="text-gray">Não foi possível carregar os usuários.</div>
    );
  }

  return (
    <div className="space-y-2">
      {users.length === 0 && <p>Nenhum usuário encontrado :(</p>}

      {users.map((user) => (
        <UserCard key={user.userId} user={user} />
      ))}
    </div>
  );
}
