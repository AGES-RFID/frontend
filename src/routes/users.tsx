import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { UserList } from "@/features/users/components/UserList";
import { Header } from "@/components/ui/header";

export function Users() {
  return (
    <>
      <Header />
      <main className="p-4">
        <header className="flex items-center justify-between">
          <Link to="/users/new">
            <Button>Criar usuário</Button>
          </Link>
        </header>

        <UserList />
      </main>
    </>
  );
}
