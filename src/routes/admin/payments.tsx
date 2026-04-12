import { SidebarDrawer } from "../../components/ui/sidebar/sidebarDrawer";

export function Payments() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarDrawer />

      {/* Main Content */}
      <main className="flex-1">
        <div className="p-8">
          <h1 className="mb-4 font-bold text-3xl text-dark-gray">Cobrança</h1>
          <p className="mb-6 text-gray">
            Gerenciamento de cobranças e pagamentos
          </p>
        </div>
      </main>
    </div>
  );
}
