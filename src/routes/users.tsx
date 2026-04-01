import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { UserList } from "@/features/users/components/UserList";

export function Users() {
  return (
    <main className="p-4">
      <header className="flex items-center justify-between">
        <h1 className="mb-4 font-bold text-2xl">Usuários</h1>

        <Link to="/users/new">
          <Button>Criar usuário</Button>
        </Link>
      </header>

      <UserList />
    </main>
  );
}
