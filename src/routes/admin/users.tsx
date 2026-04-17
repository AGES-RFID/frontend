import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Edit, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CreateUserModal,
  type CreateUserModalValue,
} from "@/features/users/components/CreateUserModal";
import { Modal } from "@/components/ui/modal";
import {
  Table,
  type TableAction,
  type TableColumn,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";

const adminUserRoleSchema = z.enum(["admin", "customer"]);

const adminUserSchema = z.object({
  userId: z.uuid(),
  name: z.string(),
  email: z.email(),
  role: adminUserRoleSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

const adminUserListSchema = z.array(adminUserSchema);

type AdminUser = z.infer<typeof adminUserSchema>;
type AdminUserRole = z.infer<typeof adminUserRoleSchema>;

type UpdateUserFormState = {
  name: string;
  email: string;
  password: string;
  role: AdminUserRole;
};

const emptyUpdateForm: UpdateUserFormState = {
  name: "",
  email: "",
  password: "",
  role: "customer",
};

const roleLabelMap: Record<AdminUserRole, string> = {
  admin: "Admin",
  customer: "Cliente",
};

import { formatDateTime } from "@/utils/formatting";

function buildCreatePayload(formData: CreateUserModalValue) {
  return {
    name: formData.fullName.trim(),
    email: formData.email.trim(),
    password: formData.password,
    role: formData.role,
  };
}

function buildUpdatePayload(formData: UpdateUserFormState) {
  return {
    name: formData.name.trim(),
    email: formData.email.trim(),
    password: formData.password || undefined,
    role: formData.role,
  };
}

export function Users() {
  const queryClient = useQueryClient();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] =
    useState<UpdateUserFormState>(emptyUpdateForm);

  const usersQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () =>
      adminUserListSchema.parse(await api.get("users").json()),
  });

  const createUserMutation = useMutation({
    mutationFn: async (formData: CreateUserModalValue) =>
      adminUserSchema.parse(
        await api.post("users", { json: buildCreatePayload(formData) }).json(),
      ),
    onSuccess: async () => {
      toast.success("Usuário criado com sucesso.");
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Erro ao criar usuário.",
      );
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({
      userId,
      formData,
    }: {
      userId: string;
      formData: UpdateUserFormState;
    }) =>
      adminUserSchema.parse(
        await api
          .patch(`users/${userId}`, { json: buildUpdatePayload(formData) })
          .json(),
      ),
    onSuccess: async () => {
      toast.success("Usuário atualizado com sucesso.");
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setEditForm(emptyUpdateForm);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Erro ao atualizar usuário.",
      );
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      await api.delete(`users/${userId}`);
    },
    onSuccess: async () => {
      toast.success("Usuário excluído com sucesso.");
      await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Erro ao excluir usuário.",
      );
    },
  });

  useEffect(() => {
    if (usersQuery.error) {
      toast.error(
        usersQuery.error instanceof Error
          ? usersQuery.error.message
          : "Não foi possível carregar os usuários.",
      );
    }
  }, [usersQuery.error]);

  const users = usersQuery.data ?? [];
  const isLoading = usersQuery.isLoading || usersQuery.isFetching;

  const columns = useMemo<TableColumn<AdminUser>[]>(
    () => [
      { key: "userId", title: "ID", className: "w-24 whitespace-nowrap" },
      { key: "name", title: "Nome", className: "w-96", sortable: true },
      { key: "email", title: "Email", className: "w-72", sortable: true },
      {
        key: "role",
        title: "Perfil",
        className: "w-32 whitespace-nowrap",
        sortable: true,
        render: (value) => roleLabelMap[value as AdminUserRole],
      },
      {
        key: "createdAt",
        title: "Criado em",
        className: "w-48 whitespace-nowrap",
        sortable: true,
        render: (value) => formatDateTime(String(value)),
      },
    ],
    [],
  );

  const actions = useMemo<TableAction<AdminUser>[]>(
    () => [
      {
        key: "edit",
        label: "Editar",
        icon: <Edit size={18} />,
        onClick: (user) => {
          setSelectedUser(user);
          setEditForm({
            name: user.name,
            email: user.email,
            password: "",
            role: user.role,
          });
          setIsEditModalOpen(true);
        },
        className:
          "text-blue hover:text-light-blue cursor-pointer transition-colors",
      },
      {
        key: "delete",
        label: "Excluir",
        icon: <Trash2 size={18} />,
        onClick: (user) => {
          setSelectedUser(user);
          setIsDeleteModalOpen(true);
        },
        className:
          "text-red hover:text-light-red cursor-pointer transition-colors",
      },
    ],
    [],
  );

  useEffect(() => {
    if (isEditModalOpen && selectedUser) {
      setEditForm({
        name: selectedUser.name,
        email: selectedUser.email,
        password: "",
        role: selectedUser.role,
      });
    }
  }, [isEditModalOpen, selectedUser]);

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const openDetailsModal = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedUser(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
    setEditForm(emptyUpdateForm);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-4 font-bold text-3xl text-dark-gray">Usuários</h1>
          <p className="mb-6 text-gray">Gerenciamento de usuários do sistema</p>
        </div>
      </div>

      {usersQuery.error ? (
        <div className="mb-6 rounded-md border border-light-gray bg-white px-4 py-3 text-gray">
          Não foi possível carregar os usuários.
        </div>
      ) : null}

      <Table
        data={users}
        columns={columns}
        actions={actions}
        loading={isLoading}
        paginationPageSize={10}
        searchPlaceholder="Pesquisar por ID, nome, email ou perfil"
        emptyMessage="Nenhum usuário cadastrado ainda."
        searchNotFoundMessage="Nenhum usuário encontrado para esta busca."
        onRowClick={openDetailsModal}
        searchBarComponent={
          <Button onClick={openCreateModal} variant="primary" size="md">
            Criar novo usuário
          </Button>
        }
      />

      <Modal
        isOpen={isDetailsModalOpen}
        onClose={closeDetailsModal}
        title="Detalhes do usuário"
      >
        {selectedUser ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-gray text-xs uppercase tracking-wide">ID</p>
                <p className="break-all text-dark-gray">
                  {selectedUser.userId}
                </p>
              </div>
              <div>
                <p className="text-gray text-xs uppercase tracking-wide">
                  Nome
                </p>
                <p className="text-dark-gray">{selectedUser.name}</p>
              </div>
              <div>
                <p className="text-gray text-xs uppercase tracking-wide">
                  Email
                </p>
                <p className="break-all text-dark-gray">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-gray text-xs uppercase tracking-wide">
                  Perfil
                </p>
                <p className="text-dark-gray">
                  {roleLabelMap[selectedUser.role]}
                </p>
              </div>
              <div>
                <p className="text-gray text-xs uppercase tracking-wide">
                  Criado em
                </p>
                <p className="text-dark-gray">
                  {formatDateTime(selectedUser.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-gray text-xs uppercase tracking-wide">
                  Atualizado em
                </p>
                <p className="text-dark-gray">
                  {formatDateTime(selectedUser.updatedAt)}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={closeDetailsModal}
                variant="secondary"
                type="button"
              >
                Fechar
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        isSubmitting={createUserMutation.isPending}
        onSubmit={(values) => createUserMutation.mutate(values)}
      />

      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Editar Usuário"
      >
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!selectedUser) return;
            updateUserMutation.mutate({
              userId: selectedUser.userId,
              formData: editForm,
            });
          }}
        >
          <Input
            label="Nome"
            value={editForm.name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setEditForm((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
            required
            width="100%"
          />
          <Input
            label="Email"
            type="email"
            value={editForm.email}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setEditForm((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
            required
            width="100%"
          />
          <Input
            label="Nova senha"
            type="password"
            value={editForm.password}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setEditForm((current) => ({
                ...current,
                password: event.target.value,
              }))
            }
            placeholder="Deixe em branco para manter a senha atual"
            showPasswordToggle
            width="100%"
          />
          <label className="flex flex-col gap-1 font-medium text-dark-gray text-sm">
            Perfil
            <select
              className="h-10 rounded-md border border-light-gray bg-white px-4 text-dark-gray outline-none focus:border-dark-gray"
              value={editForm.role}
              onChange={(event) =>
                setEditForm((current) => ({
                  ...current,
                  role: event.target.value as AdminUserRole,
                }))
              }
            >
              <option value="admin">Admin</option>
              <option value="customer">Cliente</option>
            </select>
          </label>

          <div className="flex justify-end gap-2">
            <Button onClick={closeEditModal} variant="secondary" type="button">
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateUserMutation.isPending || !selectedUser}
            >
              {updateUserMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Excluir Usuário"
      >
        <div className="space-y-4">
          <p>
            Tem certeza que deseja excluir o usuário "{selectedUser?.name}"?
          </p>
          <p className="text-gray text-sm">Esta ação não pode ser desfeita.</p>

          <div className="flex justify-end gap-2">
            <Button
              onClick={closeDeleteModal}
              variant="secondary"
              type="button"
            >
              Cancelar
            </Button>
            <Button
              onClick={() =>
                selectedUser && deleteUserMutation.mutate(selectedUser.userId)
              }
              variant="destructive"
              disabled={deleteUserMutation.isPending || !selectedUser}
            >
              {deleteUserMutation.isPending ? "Excluindo..." : "Excluir"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
