import { SidebarDrawer } from "../components/ui/sidebar/sidebarDrawer";

export function System() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarDrawer />
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-dark-gray mb-4">Sistema</h1>
          <p className="text-gray mb-6">Configurações e administração do sistema</p>
          
        </div>
      </main>
    </div>
  );
}
