import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { CreateUserModal } from "@/features/users/components/CreateUserModal";
import { DeleteUserModal } from "@/features/users/components/DeleteUserModal";
import { EditUserModal } from "@/features/users/components/EditUserModal";
import { UsersTable } from "@/features/users/components/UsersTable";
import { useGetUser, useUsers } from "@/features/users/hooks";
import type { User } from "@/features/users/model/user";

export function Users() {
  const navigate = useNavigate();
  const { data: users, isLoading: loading } = useUsers();

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

  return (
    <main>
      <div className="p-8">
        <h1 className="mb-4 font-bold text-3xl text-dark-gray">Usuários</h1>
        <p className="mb-6 text-gray">Gerenciamento de usuários do sistema</p>

        <UsersTable
          users={users || []}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreateUser={handleCreateUser}
          onNavigateToRegister={handleNavigateToRegister}
        />
      </div>

      {/* Create User Modal */}
      <CreateUserModal isOpen={isCreateModalOpen} onClose={closeCreateModal} />

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
  );
}
