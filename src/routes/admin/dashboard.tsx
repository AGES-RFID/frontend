import { SidebarDrawer } from "../../components/ui/sidebar/sidebarDrawer";

export function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarDrawer />
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-dark-gray mb-4">Dashboard</h1>
          <p className="text-gray mb-6">Bem-vindo ao painel principal do sistema IMPINJ</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-dark-gray mb-2">Veículos Ativos</h3>
              <p className="text-3xl font-bold text-blue">0</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-dark-gray mb-2">Usuários Cadastrados</h3>
              <p className="text-3xl font-bold text-teal">0</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-dark-gray mb-2">Etiquetas Emitidas</h3>
              <p className="text-3xl font-bold text-green">0</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-dark-gray mb-2">Cobranças Pendentes</h3>
              <p className="text-3xl font-bold text-yellow">0</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
