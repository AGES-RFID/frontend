import { SidebarDrawer } from "../../components/ui/sidebar/sidebarDrawer";

export function System() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarDrawer />

      {/* Main Content */}
      <main className="flex-1">
        <div className="p-8">
          <h1 className="mb-4 font-bold text-3xl text-dark-gray">Sistema</h1>
          <p className="mb-6 text-gray">
            Configurações e administração do sistema
          </p>
        </div>
      </main>
    </div>
  );
}
