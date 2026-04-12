import { SidebarDrawer } from "../../components/ui/sidebar/sidebarDrawer";

export function Labels() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarDrawer />

      {/* Main Content */}
      <main className="flex-1">
        <div className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="mb-2 font-bold text-3xl text-dark-gray">
                Etiquetas
              </h1>
              <p className="text-gray">Gerenciamento de etiquetas RFID</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
