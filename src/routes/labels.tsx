import { SidebarDrawer } from "../components/ui/sidebar/sidebarDrawer";


export function Etiquetas() {
 
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarDrawer />
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-dark-gray mb-2">Etiquetas</h1>
              <p className="text-gray">Gerenciamento de etiquetas RFID</p>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
