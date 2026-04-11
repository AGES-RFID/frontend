import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { SidebarDrawer } from "../components/ui/sidebar/sidebarDrawer";
import { Table, type TableColumn, type TableAction } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Modal } from "../components/ui/modal";
import { Edit, Trash2 } from "lucide-react";

// Type definitions for user data from backend
type UserType = "Admin" | "Cliente";

type User = {
  id: string;
  type: UserType;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

// Mock function to simulate backend data response
const fetchUsersFromBackend = (): User[] => {
  // This would be replaced with actual API call
  // Mock data for demonstration
  return [
    {
      id: "1",
      type: "Admin",
      name: "João Silva",
      email: "joao.silva@empresa.com",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      type: "Cliente",
      name: "Maria Santos",
      email: "maria.santos@empresa.com",
      createdAt: "2024-01-16T14:20:00Z",
      updatedAt: "2024-01-16T14:20:00Z",
    },
    {
      id: "3",
      type: "Admin",
      name: "Pedro Oliveira",
      email: "pedro.oliveira@empresa.com",
      createdAt: "2024-01-17T09:15:00Z",
      updatedAt: "2024-01-17T09:15:00Z",
    },
    {
      id: "4",
      type: "Cliente",
      name: "Ana Costa",
      email: "ana.costa@empresa.com",
      createdAt: "2024-01-18T16:45:00Z",
      updatedAt: "2024-01-18T16:45:00Z",
    },
    {
      id: "5",
      type: "Admin",
      name: "Carlos Ferreira",
      email: "carlos.ferreira@empresa.com",
      createdAt: "2024-01-19T11:30:00Z",
      updatedAt: "2024-01-19T11:30:00Z",
    },
    {
      id: "6",
      type: "Cliente",
      name: "Lucia Pereira",
      email: "lucia.pereira@empresa.com",
      createdAt: "2024-01-20T13:10:00Z",
      updatedAt: "2024-01-20T13:10:00Z",
    },
    {
      id: "7",
      type: "Admin",
      name: "Roberto Alves",
      email: "roberto.alves@empresa.com",
      createdAt: "2024-01-21T08:25:00Z",
      updatedAt: "2024-01-21T08:25:00Z",
    },
    {
      id: "8",
      type: "Cliente",
      name: "Fernanda Lima",
      email: "fernanda.lima@empresa.com",
      createdAt: "2024-01-22T15:40:00Z",
      updatedAt: "2024-01-22T15:40:00Z",
    },
  ];
};

export function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Function to load users from backend
  const loadUsers = () => {
    setLoading(true);
    try {
      // Simulate backend call - replace with actual API call
      const backendData = fetchUsersFromBackend();
      setUsers(backendData);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit action
  const handleEdit = (user: User) => {
    console.log("Edit user:", user.id);
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // Handle delete action
  const handleDelete = (user: User) => {
    console.log("Delete user:", user.id);
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Handle create new user
  const handleCreateUser = () => {
    setIsCreateModalOpen(true);
  };

  // Modal close handlers
  const closeCreateModal = () => setIsCreateModalOpen(false);
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  // Table columns configuration
  const columns: TableColumn<User>[] = [
    {
      key: "id",
      title: "ID",
    },
    {
      key: "type",
      title: "Tipo",
    },
    {
      key: "name",
      title: "Nome",
    },
    {
      key: "email",
      title: "Email",
    },
  ];

  // Table actions configuration
  const actions: TableAction<User>[] = [
    {
      key: "edit",
      label: "Editar",
      icon: <Edit size={18} />,
      onClick: handleEdit,
      className: "text-blue hover:text-light-blue cursor-pointer transition-colors",
    },
    {
      key: "delete",
      label: "Excluir",
      icon: <Trash2 size={18} />,
      onClick: handleDelete,
      className: "text-red hover:text-light-red cursor-pointer transition-colors",
    },
  ];

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarDrawer />
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-dark-gray mb-4">Usuários</h1>
          <p className="text-gray mb-6">Gerenciamento de usuários do sistema</p>
          
          <Table
            data={users}
            columns={columns}
            actions={actions}
            loading={loading}
            searchPlaceholder="Pesquisar por ID, tipo, nome ou email"
            emptyMessage="Nenhum usuário cadastrado ainda."
            searchNotFoundMessage="Nenhum usuário encontrado para esta busca."
            searchBarComponent={
              <Button
                onClick={handleCreateUser}
                variant="primary"
                size="md"
              >
                Criar novo usuário
              </Button>
            }
            />
          </div>
        
        {/* Create User Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          title="Criar Novo Usuário"
        >
          <div className="space-y-4">
            <p>Formulário para criar um novo usuário será implementado aqui.</p>
            <div className="flex justify-end space-x-2">
              <Button onClick={closeCreateModal} variant="secondary">
                Cancelar
              </Button>
              <Button onClick={closeCreateModal}>
                Criar
              </Button>
            </div>
          </div>
        </Modal>
        
        {/* Edit User Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          title="Editar Usuário"
        >
          <div className="space-y-4">
            <p>Editando usuário: {selectedUser?.name}</p>
            <div className="flex justify-end space-x-2">
              <Button onClick={closeEditModal} variant="secondary">
                Cancelar
              </Button>
              <Button onClick={closeEditModal}>
                Salvar
              </Button>
            </div>
          </div>
        </Modal>
        
        {/* Delete User Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          title="Excluir Usuário"
        >
          <div className="space-y-4">
            <p>Tem certeza que deseja excluir o usuário "{selectedUser?.name}"?</p>
            <p className="text-sm text-gray">Esta ação não pode ser desfeita.</p>
            <div className="flex justify-end space-x-2">
              <Button onClick={closeDeleteModal} variant="secondary">
                Cancelar
              </Button>
              <Button onClick={closeDeleteModal} variant="destructive">
                Excluir
              </Button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
}
