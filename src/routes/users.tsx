import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { UserList } from "@/features/users/components/UserList";
import { Sidebar } from "lucide-react";
import { SidebarDrawer } from "@/components/ui/sidebar/sidebarDrawer";

export function Users() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarDrawer />
      <main className="flex-1 p-4">
      <header className="flex items-center justify-between">
        <h1 className="mb-4 font-bold text-2xl">Usuários</h1>

        <Link to="/users/new">
          <Button>Criar usuário</Button>
        </Link>
      </header>

      <UserList />
    </main>
    </div>
  );
}
