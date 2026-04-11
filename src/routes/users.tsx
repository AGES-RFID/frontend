import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { SidebarDrawer } from "../components/ui/sidebar/sidebarDrawer";
import { Table, type TableColumn, type TableAction } from "../components/ui/table";
import { Button } from "../components/ui/button";
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
    // Navigate to edit page or open modal
    navigate(`/users/${user.id}/edit`);
  };

  // Handle delete action
  const handleDelete = (user: User) => {
    console.log("Delete user:", user.id);
    // Show confirmation dialog and call delete API
  };

  // Handle create new user
  const handleCreateUser = () => {
    navigate("/users/new");
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
      className: "text-blue hover:text-blue-700 transition-colors",
    },
    {
      key: "delete",
      label: "Excluir",
      icon: <Trash2 size={18} />,
      onClick: handleDelete,
      className: "text-red hover:text-red-700 transition-colors",
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
      </main>
    </div>
  );
}
