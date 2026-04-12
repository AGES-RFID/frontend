import { useState, useEffect } from "react";
import { SidebarDrawer } from "../../components/ui/sidebar/sidebarDrawer";
import {
  Table,
  type TableColumn,
  type TableAction,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Modal } from "../../components/ui/modal";
import { Edit, Trash2 } from "lucide-react";

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
  // Mock data for demonstration
  return [
    {
      id: "1",
      placa: "ABC1D23",
      proprietario: "João Silva",
      etiquetaRFID: "123456789",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      placa: "XYZ9E87",
      proprietario: "Maria Santos",
      etiquetaRFID: "987654321",
      createdAt: "2024-01-16T14:20:00Z",
      updatedAt: "2024-01-16T14:20:00Z",
    },
    {
      id: "3",
      placa: "DEF4G56",
      proprietario: "Pedro Oliveira",
      etiquetaRFID: "456789123",
      createdAt: "2024-01-17T09:15:00Z",
      updatedAt: "2024-01-17T09:15:00Z",
    },
    {
      id: "4",
      placa: "GHI7J89",
      proprietario: "Ana Costa",
      etiquetaRFID: "789123456",
      createdAt: "2024-01-18T16:45:00Z",
      updatedAt: "2024-01-18T16:45:00Z",
    },
    {
      id: "5",
      placa: "JKL5K01",
      proprietario: "Carlos Ferreira",
      etiquetaRFID: "321654987",
      createdAt: "2024-01-19T11:30:00Z",
      updatedAt: "2024-01-19T11:30:00Z",
    },
    {
      id: "6",
      placa: "MNO2L34",
      proprietario: "Lucia Pereira",
      etiquetaRFID: "654987321",
      createdAt: "2024-01-20T13:10:00Z",
      updatedAt: "2024-01-20T13:10:00Z",
    },
    {
      id: "7",
      placa: "PQR8M56",
      proprietario: "Roberto Alves",
      etiquetaRFID: "147258369",
      createdAt: "2024-01-21T08:25:00Z",
      updatedAt: "2024-01-21T08:25:00Z",
    },
    {
      id: "8",
      placa: "STU3N78",
      proprietario: "Fernanda Lima",
      etiquetaRFID: "963258147",
      createdAt: "2024-01-22T15:40:00Z",
      updatedAt: "2024-01-22T15:40:00Z",
    },
    {
      id: "9",
      placa: "VWX4O90",
      proprietario: "Ricardo Mendes",
      etiquetaRFID: "258147963",
      createdAt: "2024-01-23T12:05:00Z",
      updatedAt: "2024-01-23T12:05:00Z",
    },
    {
      id: "10",
      placa: "YZA5P12",
      proprietario: "Camila Rocha",
      etiquetaRFID: "741852963",
      createdAt: "2024-01-24T17:20:00Z",
      updatedAt: "2024-01-24T17:20:00Z",
    },
  ];
};

export function Vehicules() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

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

  // Handle edit action
  const handleEdit = (vehicle: Vehicle) => {
    console.log("Edit vehicle:", vehicle.id);
    setSelectedVehicle(vehicle);
    setIsEditModalOpen(true);
  };

  // Handle delete action
  const handleDelete = (vehicle: Vehicle) => {
    console.log("Delete vehicle:", vehicle.id);
    setSelectedVehicle(vehicle);
    setIsDeleteModalOpen(true);
  };

  // Handle create new vehicle
  const handleCreateVehicle = () => {
    setIsCreateModalOpen(true);
  };

  // Modal close handlers
  const closeCreateModal = () => setIsCreateModalOpen(false);
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedVehicle(null);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedVehicle(null);
  };

  // Table columns configuration
  const columns: TableColumn<Vehicle>[] = [
    {
      key: "placa",
      title: "Placa",
    },
    {
      key: "proprietario",
      title: "Proprietário",
    },
    {
      key: "etiquetaRFID",
      title: "Etiqueta RFID",
    },
  ];

  // Table actions configuration
  const actions: TableAction<Vehicle>[] = [
    {
      key: "edit",
      label: "Editar",
      icon: <Edit size={18} />,
      onClick: handleEdit,
      className:
        "text-blue hover:text-light-blue cursor-pointer transition-colors",
    },
    {
      key: "delete",
      label: "Excluir",
      icon: <Trash2 size={18} />,
      onClick: handleDelete,
      className:
        "text-red hover:text-light-red cursor-pointer transition-colors",
    },
  ];

  // Load vehicles on component mount
  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarDrawer />

      {/* Main Content */}
      <main className="flex-1">
        <div className="p-8">
          <h1 className="mb-4 font-bold text-3xl text-dark-gray">Veículos</h1>
          <p className="mb-6 text-gray">Gerenciamento de veículos do sistema</p>

          <Table
            data={vehicles}
            columns={columns}
            actions={actions}
            loading={loading}
            searchPlaceholder="Pesquisar por placa, proprietário ou etiqueta RFID"
            emptyMessage="Nenhum veículo cadastrado ainda."
            searchNotFoundMessage="Nenhum veículo encontrado para esta busca."
            searchBarComponent={
              <Button onClick={handleCreateVehicle} variant="primary" size="md">
                Criar novo veículo
              </Button>
            }
          />
          {/* Create Vehicle Modal */}
          <Modal
            isOpen={isCreateModalOpen}
            onClose={closeCreateModal}
            title="Criar Novo Veículo"
          >
            <div className="space-y-4">
              <p>
                Formulário para criar um novo veículo será implementado aqui.
              </p>
              <div className="flex justify-end space-x-2">
                <Button onClick={closeCreateModal} variant="secondary">
                  Cancelar
                </Button>
                <Button onClick={closeCreateModal}>Criar</Button>
              </div>
            </div>
          </Modal>

          {/* Edit Vehicle Modal */}
          <Modal
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            title="Editar Veículo"
          >
            <div className="space-y-4">
              <p>Editando veículo: {selectedVehicle?.placa}</p>
              <div className="flex justify-end space-x-2">
                <Button onClick={closeEditModal} variant="secondary">
                  Cancelar
                </Button>
                <Button onClick={closeEditModal}>Salvar</Button>
              </div>
            </div>
          </Modal>

          {/* Delete Vehicle Modal */}
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={closeDeleteModal}
            title="Excluir Veículo"
          >
            <div className="space-y-4">
              <p>
                Tem certeza que deseja excluir o veículo "
                {selectedVehicle?.placa}"?
              </p>
              <p className="text-neutral-500 text-sm">
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end space-x-2">
                <Button onClick={closeDeleteModal} variant="secondary">
                  Cancelar
                </Button>
                <Button
                  onClick={closeDeleteModal}
                  className="bg-red hover:bg-red-75"
                >
                  Excluir
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </main>
    </div>
  );
}
