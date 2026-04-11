import { useState, useMemo, useEffect } from "react";
import { SidebarDrawer } from "../components/ui/sidebar/sidebarDrawer";
import { Search, Edit, Trash2 } from "lucide-react";

// Type definitions for vehicle data from backend
type Vehicle = {
  id: string;
  placa: string;
  proprietario: string;
  etiquetaRFID: string;
  createdAt: string;
  updatedAt: string;
};

// Mock function to simulate backend data response
const fetchVehiclesFromBackend = (): Vehicle[] => {
  // This would be replaced with actual API call
  // For now, returning empty array as requested
  return [];
};

export function Veiculos() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to load vehicles from backend
  const loadVehicles = () => {
    setLoading(true);
    try {
      // Simulate backend call - replace with actual API call
      const backendData = fetchVehiclesFromBackend();
      setVehicles(backendData);
    } catch (error) {
      console.error("Error loading vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter vehicles based on search term across all fields
  const filteredVehicles = useMemo(() => {
    if (!searchTerm) return vehicles;
    
    const searchLower = searchTerm.toLowerCase();
    
    return vehicles.filter(vehicle => 
      vehicle.placa.toLowerCase().includes(searchLower) ||
      vehicle.proprietario.toLowerCase().includes(searchLower) ||
      vehicle.etiquetaRFID.toLowerCase().includes(searchLower)
    );
  }, [vehicles, searchTerm]);

  // Function to highlight search matches
  const highlightText = (text: string) => {
    if (!searchTerm) return text;
    
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return (
      <>
        {parts.map((part, index) => 
          part.toLowerCase() === searchTerm.toLowerCase() ? (
            <span key={index} className="font-bold">{part}</span>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </>
    );
  };

  // Handle edit action
  const handleEdit = (vehicleId: string) => {
    console.log("Edit vehicle:", vehicleId);
    // Navigate to edit page or open modal
  };

  // Handle delete action
  const handleDelete = (vehicleId: string) => {
    console.log("Delete vehicle:", vehicleId);
    // Show confirmation dialog and call delete API
  };

  // Load vehicles on component mount
  useEffect(() => {
    loadVehicles();
  }, []);
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarDrawer />
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-dark-gray mb-4">Veículos</h1>
          <p className="text-gray mb-6">Gerenciamento de veículos do sistema</p>
          
          <div className="bg-white p-6">
            {/* Search and Create Button */}
            <div className="mb-6 flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Pesquisar por placa, proprietário ou etiqueta RFID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="bg-blue text-white px-4 py-2 rounded-lg hover:bg-light-blue transition-colors">
                Criar novo veículo
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-dark-blue text-white">
                    <th className="py-3 px-4 text-left font-medium">Placa</th>
                    <th className="py-3 px-4 text-left font-medium">Proprietário</th>
                    <th className="py-3 px-4 text-left font-medium">Etiqueta RFID</th>
                    <th className="py-3 px-4 text-left font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-gray">
                        Carregando...
                      </td>
                    </tr>
                  ) : filteredVehicles.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-gray">
                        {searchTerm ? "Nenhum veículo encontrado para esta busca." : "Nenhum veículo cadastrado ainda."}
                      </td>
                    </tr>
                  ) : (
                    filteredVehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="border-b border-gray-200">
                        <td className="py-3 px-4">{highlightText(vehicle.placa)}</td>
                        <td className="py-3 px-4">{highlightText(vehicle.proprietario)}</td>
                        <td className="py-3 px-4">{highlightText(vehicle.etiquetaRFID)}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEdit(vehicle.id)}
                              className="text-blue hover:text-blue-700 transition-colors"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(vehicle.id)}
                              className="text-red hover:text-red-700 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
