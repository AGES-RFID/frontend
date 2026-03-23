import { useUsers } from "../hooks/useUsers";
import { UserCard } from "./UserCard";

export function UserList() {
  const { data: users, status, error } = useUsers();

  if (status === "pending") {
    return <div>Carregando...</div>;
  }
  if (status === "error") {
    console.log(error);
    return (
      <div className="text-red-800">Algo deu errado ao buscar os usuários</div>
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
