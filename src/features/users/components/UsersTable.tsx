import { Table, type TableColumn, type TableAction } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import type { User } from "@/features/users/model/user";

interface UsersTableProps {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onCreateUser: () => void;
  onNavigateToRegister?: () => void;
}

export function UsersTable({ users, loading, onEdit, onDelete, onCreateUser, onNavigateToRegister }: UsersTableProps) {
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
      onClick: onEdit,
      className: "text-blue hover:text-light-blue cursor-pointer transition-colors",
    },
    {
      key: "delete",
      label: "Excluir",
      icon: <Trash2 size={18} />,
      onClick: onDelete,
      className: "text-red hover:text-light-red cursor-pointer transition-colors",
    },
  ];

  return (
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
          onClick={onNavigateToRegister || onCreateUser}
          variant="primary"
          size="md"
        >
          Criar novo usuário
        </Button>
      }
    />
  );
}
