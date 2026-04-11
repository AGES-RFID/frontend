import { UserCard } from "@/features/users/components/UserCard";
import { SidebarDrawer } from "../components/ui/sidebar/sidebarDrawer";
import { UserForm } from "@/features/users/components/UserForm";

export function Home() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      
      

      {/* Main Content */}
      <main className="flex-1">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-dark-gray mb-4">Dashboard</h1>
          <p className="text-gray">Bem-vindo ao sistema IMPINJ</p>
        </div>


        <UserForm onSubmit={() => {}} buttonText="Salvar" />
      </main>
    </div>
  );
}