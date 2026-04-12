import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { SidebarDrawer } from "../../components/ui/sidebar/sidebarDrawer";
import type { User } from "@/features/users/model/user";
import { CreateUserModal } from "@/features/users/components/CreateUserModal";
import { EditUserModal } from "@/features/users/components/EditUserModal";
import { DeleteUserModal } from "@/features/users/components/DeleteUserModal";
import { UsersTable } from "@/features/users/components/UsersTable";


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

  // Handle navigate to registration page
  const handleNavigateToRegister = () => {
    navigate("/admin/users/register");
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
          
          <UsersTable
            users={users}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreateUser={handleCreateUser}
            onNavigateToRegister={handleNavigateToRegister}
          />
          </div>
        
        {/* Create User Modal */}
        <CreateUserModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
        />
        
        {/* Edit User Modal */}
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          selectedUser={selectedUser}
        />
        
        {/* Delete User Modal */}
        <DeleteUserModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          selectedUser={selectedUser}
        />
      </main>
    </div>
  );
}
